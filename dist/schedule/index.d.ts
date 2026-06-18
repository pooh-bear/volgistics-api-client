import { GetScheduleOptions, ScheduleEntry, AddScheduleEntryOptions, DeleteScheduleEntryOptions, AddScheduleResponse, DeleteScheduleResponse } from "./index.d";
export declare const getSchedule: ({ baseUrl, orgId, authorization, apiKey, date, prefix }: GetScheduleOptions) => Promise<ScheduleEntry[]>;
/**
 * Sign up for an open shift
 */
export declare const addScheduleEntry: ({ baseUrl, orgId, authorization, apiKey, jobNum, slotNum, volNum, from, to, volCount, anyTime, entryNote, slotNumbers, }: AddScheduleEntryOptions) => Promise<AddScheduleResponse>;
/**
 * Remove a scheduled shift (volunteer sign-off)
 */
export declare const deleteScheduleEntry: ({ baseUrl, orgId, authorization, apiKey, date, fillNumbers, }: DeleteScheduleEntryOptions) => Promise<DeleteScheduleResponse>;
declare const _default: {
    getSchedule: ({ baseUrl, orgId, authorization, apiKey, date, prefix }: GetScheduleOptions) => Promise<ScheduleEntry[]>;
    addScheduleEntry: ({ baseUrl, orgId, authorization, apiKey, jobNum, slotNum, volNum, from, to, volCount, anyTime, entryNote, slotNumbers, }: AddScheduleEntryOptions) => Promise<AddScheduleResponse>;
    deleteScheduleEntry: ({ baseUrl, orgId, authorization, apiKey, date, fillNumbers, }: DeleteScheduleEntryOptions) => Promise<DeleteScheduleResponse>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map