export interface GetScheduleOptions { 
    baseUrl: string;
    orgId: string;
    authorization: string;
    apiKey: string;
    date: string|Date;
    prefix?: string;
}

export interface ScheduleEntry {
    title: string;
    start: string;
    end: string;
    color: {
        primary: string;
        secondary: string;
    };
    meta: {
        type: string;
        fillNum: number;
        jobNum: number;
        slotNum: number;
        openingNote: string | null;
        entryNote: string | null;
        canEditEntryNote: boolean;
        regular: boolean;
        volsNeeded?: number;
        fillNumbers?: number[];
        slotNumbers?: number[];
    };
}

export interface AddScheduleEntryOptions {
    baseUrl: string;
    orgId: string;
    authorization: string;
    apiKey: string;
    /** Job number from the opening */
    jobNum: number;
    /** Slot number from the opening */
    slotNum: number;
    /** Volunteer master key (from JWT) */
    volNum: number;
    /** Shift start time (ISO string) */
    from: string;
    /** Shift end time (ISO string) */
    to: string;
    /** Number of volunteers to sign up (default 1) */
    volCount?: number;
    /** Whether the shift is all-day */
    anyTime?: boolean;
    /** Optional entry note */
    entryNote?: string;
    /** Slot numbers array (usually [slotNum]) - required by the API */
    slotNumbers?: number[];
}

export interface DeleteScheduleEntryOptions {
    baseUrl: string;
    orgId: string;
    authorization: string;
    apiKey: string;
    /** Date of the shift (ISO string) */
    date: string;
    /** Fill number(s) from the scheduled entry */
    fillNumbers: number[];
}

export interface VErrorResponse {
    number: number;
    type: string | null;
    description: string;
}

export interface AddScheduleResponse {
    vError: VErrorResponse;
    selfScheduleCount: number;
    schedule: ScheduleEntry[];
}

export interface DeleteScheduleResponse {
    vError: VErrorResponse;
    selfScheduleCount: number;
    schedule: ScheduleEntry[];
}
