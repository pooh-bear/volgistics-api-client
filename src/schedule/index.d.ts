export interface GetScheduleOptions { 
    baseUrl: string;
    orgId: string;
    authorization: string; 
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
    };
}
