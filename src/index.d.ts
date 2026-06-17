export interface VolgisticsClient {
    login: (params: { email: string; password: string }) => Promise<void>;
    getSchedule: (params: GetScheduleOptions) => Promise<any>;
    addScheduleEntry: (params: Omit<AddScheduleEntryParams, 'baseUrl' | 'orgId' | 'authorization' | 'volNum' | 'apiKey'>) => Promise<any>;
    deleteScheduleEntry: (params: Omit<DeleteScheduleEntryParams, 'baseUrl' | 'orgId' | 'authorization' | 'apiKey'>) => Promise<any>;
}

export interface VolgisticsClientOptions {
    baseUrl?: string;
    orgId: string|number;
    /** VicNet X-API-Key header value */
    apiKey?: string;
}

export interface GetScheduleOptions {
    date: string|Date;
    prefix?: string;
}

export interface AddScheduleEntryOptions {
    jobNum: number;
    slotNum: number;
    from: string;
    to: string;
    volCount?: number;
    anyTime?: boolean;
    entryNote?: string;
    slotNumbers?: number[];
}

export interface AddScheduleEntryParams {
    baseUrl: string;
    orgId: string;
    authorization: string;
    apiKey: string;
    volNum: number;
    jobNum: number;
    slotNum: number;
    from: string;
    to: string;
    volCount?: number;
    anyTime?: boolean;
    entryNote?: string;
    slotNumbers?: number[];
}

export interface DeleteScheduleEntryOptions {
    date: string;
    fillNumbers: number[];
}

export interface DeleteScheduleEntryParams {
    baseUrl: string;
    orgId: string;
    authorization: string;
    apiKey: string;
    date: string;
    fillNumbers: number[];
}