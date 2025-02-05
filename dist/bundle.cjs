'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const initialRequestHeaders = {
    "Accept": "application/json, text/plain, */*",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "X-API-Key": "6wRWFhd.aVNctG6h4Y5f4Kp4furHA4CypFdSrtE7",
};
const initReqHeaders = ({ referer, authorization }) => {
    let headers = {
        ...initialRequestHeaders,
        "Referer": referer,
    };
    if (authorization) {
        headers["Authorization"] = authorization;
    }
    return headers;
};
const postReqHeaders = ({ referer, authorization }) => {
    return {
        ...initReqHeaders({ referer, authorization }),
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
    jwt;
    constructor({ baseUrl, orgId }) {
        this.orgId = orgId;
        this.baseUrl = baseUrl;
    }
    async login({ email, password }) {
        const loginEndpoint = 'auth/log-in';
        const referer = `${this.baseUrl}${this.orgId}/login`;
        const headers = postReqHeaders({ referer });
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
}

const getSchedule = async ({ baseUrl, orgId, authorization, date, prefix }) => {
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
    const headers = initReqHeaders({ referer, authorization });
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
    constructor({ baseUrl, orgId }) {
        baseUrl = baseUrl || 'https://www.volgistics.com/api/vicnet/';
        this.baseUrl = baseUrl;
        orgId = String(orgId);
        this.orgId = orgId;
        this.auth = new Auth({ baseUrl, orgId });
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
            date,
            prefix
        });
    }
}
var index = {
    Auth
};

exports.VolgisticsClient = VolgisticsClient;
exports.default = index;
