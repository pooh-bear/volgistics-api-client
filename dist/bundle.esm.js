import { request } from 'https';

const baseHeaders$1 = (apiKey) => ({
    "Accept": "application/json, text/plain, */*",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "X-API-Key": apiKey,
});
const initReqHeaders = ({ referer, authorization, apiKey }) => {
    let headers = {
        ...baseHeaders$1(apiKey),
        "Referer": referer,
    };
    if (authorization) {
        headers["Authorization"] = authorization;
    }
    return headers;
};
const postReqHeaders = ({ referer, authorization, apiKey }) => {
    return {
        ...initReqHeaders({ referer, authorization, apiKey }),
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Origin": "https://www.volgistics.com",
        "Priority": "u=3, i",
    };
};

class Auth {
    orgId;
    baseUrl;
    apiKey;
    jwt;
    constructor({ baseUrl, orgId, apiKey }) {
        this.orgId = orgId;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    async login({ email, password }) {
        const loginEndpoint = 'auth/log-in';
        const referer = `${this.baseUrl}${this.orgId}/login`;
        const headers = postReqHeaders({ referer, apiKey: this.apiKey });
        const response = await fetch(`${this.baseUrl}${loginEndpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password, FROM: this.orgId })
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        else if (!data.jwt) {
            throw new Error('No JWT found in response');
        }
        this.jwt = data.jwt;
        return data;
    }
    getJwt() {
        return this.jwt;
    }
    getAuthorization() {
        return `Bearer ${this.jwt}`;
    }
    getMasterKey() {
        if (!this.jwt) {
            throw new Error('Not authenticated. Call login() first.');
        }
        const payload = this.jwt.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.masterKey;
    }
}

/** Base headers for schedule API calls */
const baseHeaders = (apiKey) => ({
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
    'X-API-Key': apiKey,
});
/**
 * Custom HTTPS fetcher using Node's native https module.
 * Volgistics API doesn't handle HTTP/2 POST/DELETE bodies well.
 * Node's https module negotiates HTTP/1.1 automatically.
 */
function http11Request(url, options) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const body = options.body || '';
        const req = request({
            hostname: u.hostname,
            port: 443,
            path: u.pathname + u.search,
            method: options.method,
            headers: {
                ...options.headers,
                'Host': u.hostname,
                'Content-Length': Buffer.byteLength(body).toString(),
            },
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode || 500, data }));
        });
        req.on('error', reject);
        if (body)
            req.write(body);
        req.end();
    });
}
const getSchedule = async ({ baseUrl, orgId, authorization, apiKey, date, prefix }) => {
    const dateObj = new Date(date);
    const dateDMY = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    const dateISO = dateObj.toISOString();
    const getEndpoint = 'schedule';
    const referer = `${baseUrl}${orgId}/schedule?view=month&date=${dateDMY}`;
    const params = new URLSearchParams({
        date: dateISO,
        timeSpan: '0',
        kind: 'volunteer',
        daySearch: '0',
        firstCall: 'true',
        currView: 'month',
        platform: 'web',
    });
    const headers = {
        ...baseHeaders(apiKey),
        'Referer': referer,
        'Authorization': authorization,
    };
    const response = await fetch(`${baseUrl}${getEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers,
    });
    const resp = await response.json();
    if (!resp && !resp.schedule && !(resp.schedule?.length >= 0)) {
        throw new Error('No schedule found');
    }
    const data = resp.schedule;
    if (!prefix) {
        return data;
    }
    return data.filter(entry => entry.title.startsWith(prefix));
};
/** Minimal mutation headers that match what the Angular app sends */
const mutationHeaders = ({ referer, authorization, apiKey }) => ({
    'Authorization': authorization,
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'Accept': 'application/json, text/plain, */*',
    'Referer': referer,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
});
/**
 * Sign up for an open shift
 */
const addScheduleEntry = async ({ baseUrl, orgId, authorization, apiKey, jobNum, slotNum, volNum, from, to, volCount = 1, anyTime = false, entryNote, slotNumbers, }) => {
    const endpoint = 'schedule';
    const referer = `${baseUrl}${orgId}/schedule?view=month`;
    const headers = mutationHeaders({ referer, authorization, apiKey });
    const body = {
        jobNum,
        from,
        to,
        slotNum,
        volNum,
        volCount,
        anyTime,
        isMyScheduleView: false,
        slotNumbers: JSON.stringify(slotNumbers || [slotNum]),
    };
    if (entryNote) {
        body.entryNote = entryNote;
    }
    const response = await http11Request(`${baseUrl}${endpoint}?action=add&kind=single`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    const resp = JSON.parse(response.data);
    if (resp.vError && resp.vError.number !== 0) {
        throw new Error(resp.vError.description || 'Failed to add schedule entry');
    }
    return resp;
};
/**
 * Remove a scheduled shift (volunteer sign-off)
 */
const deleteScheduleEntry = async ({ baseUrl, orgId, authorization, apiKey, date, fillNumbers, }) => {
    const endpoint = 'schedule';
    const referer = `${baseUrl}${orgId}/schedule`;
    const headers = mutationHeaders({ referer, authorization, apiKey });
    const response = await http11Request(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
            date,
            fillNumbers: JSON.stringify(fillNumbers),
            isListView: false,
        }),
    });
    const resp = JSON.parse(response.data);
    if (resp.vError && resp.vError.number !== 0) {
        throw new Error(resp.vError.description || 'Failed to delete schedule entry');
    }
    return resp;
};

/**
 * VolgisticsClient provides an interface to interact with the Volgistics API
 *
 * @param options.baseUrl - Base URL override for the Volgistics API
 * @param options.orgId - Organization ID for authentication
 */
class VolgisticsClient {
    auth;
    baseUrl;
    orgId;
    apiKey;
    constructor({ baseUrl, orgId, apiKey }) {
        baseUrl = baseUrl || 'https://www.volgistics.com/api/vicnet/';
        this.baseUrl = baseUrl;
        orgId = String(orgId);
        this.orgId = orgId;
        if (!apiKey) {
            throw new Error('VolgisticsClient: apiKey is required');
        }
        this.apiKey = apiKey;
        this.auth = new Auth({ baseUrl, orgId, apiKey });
    }
    /**
     * Authenticates a user with email and password
     *
     * @param options.email - User's email address
     * @param options.password - User's password
     * @returns Promise resolving to true on successful login
     * @throws Error if login fails or response contains error
     */
    async login({ email, password }) {
        const loginResponse = await this.auth.login({ email, password });
        if (loginResponse.error) {
            throw new Error(loginResponse.error);
        }
        return true;
    }
    /**
     * Gets the client's current JWT token
     *
     * @returns Promise resolving to the JWT token string
     */
    async getJwt() {
        return this.auth.getJwt();
    }
    /**
     * Retrieves schedule entries for a given date
     *
     * @param options.date - Date to retrieve schedule for (string or Date object)
     * @param options.prefix - Optional prefix to filter schedule entries by title
     * @returns Promise resolving to array of ScheduleEntry objects
     * @throws Error if schedule cannot be retrieved
     */
    async getSchedule({ date, prefix }) {
        const authorization = this.auth.getAuthorization();
        return getSchedule({
            baseUrl: this.baseUrl,
            orgId: this.orgId,
            authorization,
            apiKey: this.apiKey,
            date,
            prefix
        });
    }
    /**
     * Signs up for an open shift
     *
     * @param options.jobNum - Job number from the opening
     * @param options.slotNum - Slot number from the opening
     * @param options.from - Shift start time (ISO string)
     * @param options.to - Shift end time (ISO string)
     * @param options.volCount - Number of volunteers to sign up (default 1)
     * @param options.anyTime - Whether the shift is all-day
     * @param options.entryNote - Optional entry note
     * @returns Promise resolving to the API response
     */
    async addScheduleEntry({ jobNum, slotNum, from, to, volCount, anyTime, entryNote, slotNumbers }) {
        const authorization = this.auth.getAuthorization();
        const volNum = this.auth.getMasterKey();
        return addScheduleEntry({
            baseUrl: this.baseUrl,
            orgId: this.orgId,
            authorization,
            apiKey: this.apiKey,
            jobNum,
            slotNum,
            volNum,
            from,
            to,
            volCount,
            anyTime,
            entryNote,
            slotNumbers,
        });
    }
    /**
     * Removes a scheduled shift
     *
     * @param options.date - Date of the shift (ISO string)
     * @param options.fillNumbers - Fill number(s) from the scheduled entry
     * @returns Promise resolving to the API response
     */
    async deleteScheduleEntry({ date, fillNumbers }) {
        const authorization = this.auth.getAuthorization();
        return deleteScheduleEntry({
            baseUrl: this.baseUrl,
            orgId: this.orgId,
            authorization,
            apiKey: this.apiKey,
            date,
            fillNumbers,
        });
    }
}
var index = {
    Auth
};

export { VolgisticsClient, index as default };
