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
exports.Auth = void 0;
const headerHelper_1 = require("../helpers/headerHelper");
class Auth {
    constructor({ baseUrl, orgId }) {
        this.orgId = orgId;
        this.baseUrl = baseUrl;
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const loginEndpoint = 'auth/log-in';
            const referer = `${this.baseUrl}${this.orgId}/login`;
            const headers = (0, headerHelper_1.postReqHeaders)({ referer });
            const response = yield fetch(`${this.baseUrl}${loginEndpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ email, password, FROM: this.orgId })
            });
            const data = yield response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            else if (!data.jwt) {
                throw new Error('No JWT found in response');
            }
            this.jwt = data.jwt;
            return data;
        });
    }
    getJwt() {
        return this.jwt;
    }
    getAuthorization() {
        return `Bearer ${this.jwt}`;
    }
}
exports.Auth = Auth;
