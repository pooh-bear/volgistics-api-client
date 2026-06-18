import { AuthOptions } from "./index.d";
import { postReqHeaders } from "../helpers/headerHelper";

export class Auth {
    private orgId: string;
    private baseUrl: string;
    private apiKey: string;
    private jwt!: string;

    constructor({ baseUrl, orgId, apiKey }: { baseUrl: string; orgId: string; apiKey: string }) {
        this.orgId = orgId;
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    async login({ email, password }: AuthOptions) {
        const loginEndpoint = 'auth/log-in';
        const referer = `${this.baseUrl}${this.orgId}/login`;

        const headers = postReqHeaders({ referer, apiKey: this.apiKey });

        const response = await fetch(`${this.baseUrl}${loginEndpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email, password, FROM: this.orgId })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        } else if (!data.jwt) {
            throw new Error('No JWT found in response');
        }

        this.jwt = data.jwt;

        return data;
    }

    getJwt() {
        return this.jwt;
    }

    getAuthorization() {
        return `Bearer ${this.jwt}`;
    }

    getMasterKey(): number {
        if (!this.jwt) {
            throw new Error('Not authenticated. Call login() first.');
        }
        const payload = this.jwt.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.masterKey as number;
    }
}
