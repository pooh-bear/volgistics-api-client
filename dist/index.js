"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolgisticsClient = void 0;
const auth_1 = require("./auth");
const schedule_1 = require("./schedule");
/**
 * VolgisticsClient provides an interface to interact with the Volgistics API
 *
 * @param options.baseUrl - Base URL override for the Volgistics API
 * @param options.orgId - Organization ID for authentication
 */
class VolgisticsClient {
    constructor({ baseUrl, orgId }) {
        baseUrl = baseUrl || 'https://www.volgistics.com/api/vicnet/';
        this.baseUrl = baseUrl;
        orgId = String(orgId);
        this.orgId = orgId;
        this.auth = new auth_1.Auth({ baseUrl, orgId });
    }
    /**
     * Authenticates a user with email and password
     *
     * @param options.email - User's email address
     * @param options.password - User's password
     * @returns Promise resolving to true on successful login
     * @throws Error if login fails or response contains error
     */
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const loginResponse = yield this.auth.login({ email, password });
            if (loginResponse.error) {
                throw new Error(loginResponse.error);
            }
            return true;
        });
    }
    /**
     * Gets the client's current JWT token
     *
     * @returns Promise resolving to the JWT token string
     */
    getJwt() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.auth.getJwt();
        });
    }
    /**
     * Retrieves schedule entries for a given date
     *
     * @param options.date - Date to retrieve schedule for (string or Date object)
     * @param options.prefix - Optional prefix to filter schedule entries by title
     * @returns Promise resolving to array of ScheduleEntry objects
     * @throws Error if schedule cannot be retrieved
     */
    getSchedule(_a) {
        return __awaiter(this, arguments, void 0, function* ({ date, prefix }) {
            const authorization = this.auth.getAuthorization();
            return (0, schedule_1.getSchedule)({
                baseUrl: this.baseUrl,
                orgId: this.orgId,
                authorization,
                date,
                prefix
            });
        });
    }
}
exports.VolgisticsClient = VolgisticsClient;
exports.default = {
    Auth: auth_1.Auth
};
