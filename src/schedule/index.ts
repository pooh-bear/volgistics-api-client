import { request as httpsRequest } from 'https';
import { GetScheduleOptions, ScheduleEntry, AddScheduleEntryOptions, DeleteScheduleEntryOptions, AddScheduleResponse, DeleteScheduleResponse } from "./index.d";
import { USER_AGENT } from "../helpers/constants";

/** Base headers for schedule API calls */
const baseHeaders = (apiKey: string) => ({
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': USER_AGENT,
    'X-API-Key': apiKey,
});

/**
 * Custom HTTPS fetcher using Node's native https module.
 * Volgistics API doesn't handle HTTP/2 POST/DELETE bodies well.
 * Node's https module negotiates HTTP/1.1 automatically.
 */
function http11Request(url: string, options: {
    method: string;
    headers: Record<string, string>;
    body?: string;
}): Promise<{ status: number; data: string }> {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const body = options.body || '';
        const req = httpsRequest({
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
            res.on('data', (chunk: string) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode || 500, data }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}


export const getSchedule = async ({ 
    baseUrl,
    orgId,
    authorization,
    apiKey,
    date,
    prefix
}: GetScheduleOptions): Promise<ScheduleEntry[]> => {
    const dateObj = new Date(date);
    const dateDMY = dateObj.toLocaleDateString(
        'en-US', 
        { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        }
    );
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

    const data = resp.schedule as ScheduleEntry[];

    if (!prefix) {
        return data;
    }

    return data.filter(entry => entry.title.startsWith(prefix));
}

/** Minimal mutation headers that match what the Angular app sends */
const mutationHeaders = ({ referer, authorization, apiKey }: { referer: string; authorization: string; apiKey: string }) => ({
    'Authorization': authorization,
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'Accept': 'application/json, text/plain, */*',
    'Referer': referer,
    'User-Agent': USER_AGENT,
});

/**
 * Sign up for an open shift
 */
export const addScheduleEntry = async ({
    baseUrl,
    orgId,
    authorization,
    apiKey,
    jobNum,
    slotNum,
    volNum,
    from,
    to,
    volCount = 1,
    anyTime = false,
    entryNote,
    slotNumbers,
}: AddScheduleEntryOptions): Promise<AddScheduleResponse> => {
    const endpoint = 'schedule';
    const referer = `${baseUrl}${orgId}/schedule?view=month`;
    const headers = mutationHeaders({ referer, authorization, apiKey });

    const body: Record<string, unknown> = {
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

    return resp as AddScheduleResponse;
};

/**
 * Remove a scheduled shift (volunteer sign-off)
 */
export const deleteScheduleEntry = async ({
    baseUrl,
    orgId,
    authorization,
    apiKey,
    date,
    fillNumbers,
}: DeleteScheduleEntryOptions): Promise<DeleteScheduleResponse> => {
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

    return resp as DeleteScheduleResponse;
};

export default {
    getSchedule,
    addScheduleEntry,
    deleteScheduleEntry,
};