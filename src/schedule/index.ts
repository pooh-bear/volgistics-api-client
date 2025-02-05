import { GetScheduleOptions, ScheduleEntry } from "./index.d";
import { initReqHeaders } from "../helpers/headerHelper";


export const getSchedule = async ({ 
    baseUrl,
    orgId,
    authorization,
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

    const headers = initReqHeaders({ referer, authorization });

    const response = await fetch(`${baseUrl}${getEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers,
    });

    const resp = await response.json();

    console.log(resp);

    if (!resp && !resp.schedule && !(resp.schedule?.length >= 0)) {
        throw new Error('No schedule found');
    }

    const data = resp.schedule as ScheduleEntry[];

    if (!prefix) {
        return data;
    }

    return data.filter(entry => entry.title.startsWith(prefix));
}