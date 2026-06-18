import { Auth } from '@/auth/index';
import { AuthOptions } from '@/auth/index.d';
import { GetScheduleOptions, VolgisticsClientOptions, AddScheduleEntryOptions, DeleteScheduleEntryOptions } from './index.d';
/**
 * VolgisticsClient provides an interface to interact with the Volgistics API
 *
 * @param options.baseUrl - Base URL override for the Volgistics API
 * @param options.orgId - Organization ID for authentication
 */
export declare class VolgisticsClient {
    private auth;
    private baseUrl;
    private orgId;
    private apiKey;
    constructor({ baseUrl, orgId, apiKey }: VolgisticsClientOptions);
    /**
     * Authenticates a user with email and password
     *
     * @param options.email - User's email address
     * @param options.password - User's password
     * @returns Promise resolving to true on successful login
     * @throws Error if login fails or response contains error
     */
    login({ email, password }: AuthOptions): Promise<boolean>;
    /**
     * Gets the client's current JWT token
     *
     * @returns Promise resolving to the JWT token string
     */
    getJwt(): Promise<string>;
    /**
     * Retrieves schedule entries for a given date
     *
     * @param options.date - Date to retrieve schedule for (string or Date object)
     * @param options.prefix - Optional prefix to filter schedule entries by title
     * @returns Promise resolving to array of ScheduleEntry objects
     * @throws Error if schedule cannot be retrieved
     */
    getSchedule({ date, prefix }: GetScheduleOptions): Promise<import("./schedule/index").ScheduleEntry[]>;
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
    addScheduleEntry({ jobNum, slotNum, from, to, volCount, anyTime, entryNote, slotNumbers }: Omit<AddScheduleEntryOptions, 'baseUrl' | 'orgId' | 'authorization' | 'volNum' | 'apiKey'>): Promise<import("./schedule/index").AddScheduleResponse>;
    /**
     * Removes a scheduled shift
     *
     * @param options.date - Date of the shift (ISO string)
     * @param options.fillNumbers - Fill number(s) from the scheduled entry
     * @returns Promise resolving to the API response
     */
    deleteScheduleEntry({ date, fillNumbers }: Omit<DeleteScheduleEntryOptions, 'baseUrl' | 'orgId' | 'authorization' | 'apiKey'>): Promise<import("./schedule/index").DeleteScheduleResponse>;
}
declare const _default: {
    Auth: typeof Auth;
};
export default _default;
//# sourceMappingURL=index.d.ts.map