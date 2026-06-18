import { AuthOptions } from "./index.d";
export declare class Auth {
    private orgId;
    private baseUrl;
    private apiKey;
    private jwt;
    constructor({ baseUrl, orgId, apiKey }: {
        baseUrl: string;
        orgId: string;
        apiKey: string;
    });
    login({ email, password }: AuthOptions): Promise<any>;
    getJwt(): string;
    getAuthorization(): string;
    getMasterKey(): number;
}
//# sourceMappingURL=index.d.ts.map