import { Auth } from './auth';
import { getSchedule } from './schedule';
import { AuthOptions } from './auth/index.d';
import { GetScheduleOptions, VolgisticsClientOptions } from './index.d';

/**
 * VolgisticsClient provides an interface to interact with the Volgistics API
 * 
 * @param options.baseUrl - Base URL override for the Volgistics API
 * @param options.orgId - Organization ID for authentication
 */
export class VolgisticsClient {
    private auth: Auth;
    private baseUrl: string;
    private orgId: string;

    constructor({ baseUrl, orgId }: VolgisticsClientOptions) {
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
    async login({ email, password }: AuthOptions) {
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
    async getSchedule({ date, prefix }: GetScheduleOptions) {
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

export default {
    Auth
}
