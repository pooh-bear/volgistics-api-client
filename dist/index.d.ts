import { Auth } from '@/auth/index';
import { AuthOptions } from '@/auth/index.d';
import { GetScheduleOptions, VolgisticsClientOptions } from './index.d';
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
    constructor({ baseUrl, orgId }: VolgisticsClientOptions);
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
}
declare const _default: {
    Auth: typeof Auth;
};
export default _default;
