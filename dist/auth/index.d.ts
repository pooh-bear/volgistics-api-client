import { AuthOptions } from "./index.d";
export declare class Auth {
    private orgId;
    private baseUrl;
    private jwt;
    constructor({ baseUrl, orgId }: {
        baseUrl: string;
        orgId: string;
    });
    login({ email, password }: AuthOptions): Promise<any>;
    getJwt(): string;
    getAuthorization(): string;
}
