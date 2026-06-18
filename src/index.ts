import { Auth } from '@/auth/index';
import { getSchedule, addScheduleEntry, deleteScheduleEntry } from '@/schedule/index';
import { AuthOptions } from '@/auth/index.d';
import { GetScheduleOptions, VolgisticsClientOptions, AddScheduleEntryOptions, DeleteScheduleEntryOptions } from './index.d';

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
    private apiKey: string;

    constructor({ baseUrl, orgId, apiKey }: VolgisticsClientOptions) {
        baseUrl = baseUrl || 'https://www.volgistics.com/api/vicnet/';
        this.baseUrl = baseUrl;
        orgId = String(orgId);
        this.orgId = orgId;
        if (!apiKey) {
            throw new Error('VolgisticsClient: apiKey is required');
        }
        this.apiKey = apiKey;

        this.auth = new Auth({ baseUrl, orgId, apiKey });
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
            apiKey: this.apiKey,
            date,
            prefix
        });
    }

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
    async addScheduleEntry({ jobNum, slotNum, from, to, volCount, anyTime, entryNote, slotNumbers }: Omit<AddScheduleEntryOptions, 'baseUrl' | 'orgId' | 'authorization' | 'volNum' | 'apiKey'>) {
        const authorization = this.auth.getAuthorization();
        const volNum = this.auth.getMasterKey();
        return addScheduleEntry({
            baseUrl: this.baseUrl,
            orgId: this.orgId,
            authorization,
            apiKey: this.apiKey,
            jobNum,
            slotNum,
            volNum,
            from,
            to,
            volCount,
            anyTime,
            entryNote,
            slotNumbers,
        });
    }

    /**
     * Removes a scheduled shift
     * 
     * @param options.date - Date of the shift (ISO string)
     * @param options.fillNumbers - Fill number(s) from the scheduled entry
     * @returns Promise resolving to the API response
     */
    async deleteScheduleEntry({ date, fillNumbers }: Omit<DeleteScheduleEntryOptions, 'baseUrl' | 'orgId' | 'authorization' | 'apiKey'>) {
        const authorization = this.auth.getAuthorization();
        return deleteScheduleEntry({
            baseUrl: this.baseUrl,
            orgId: this.orgId,
            authorization,
            apiKey: this.apiKey,
            date,
            fillNumbers,
        });
    }
}

export default {
    Auth
}
