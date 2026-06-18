export declare const initReqHeaders: ({ referer, authorization, apiKey }: {
    referer: string;
    authorization?: string;
    apiKey: string;
}) => Record<string, string>;
export declare const postReqHeaders: ({ referer, authorization, apiKey }: {
    referer: string;
    authorization?: string;
    apiKey: string;
}) => {
    "Content-Type": string;
    "Accept-Language": string;
    "Accept-Encoding": string;
    Origin: string;
    Priority: string;
};
declare const _default: {
    initReqHeaders: ({ referer, authorization, apiKey }: {
        referer: string;
        authorization?: string;
        apiKey: string;
    }) => Record<string, string>;
    postReqHeaders: ({ referer, authorization, apiKey }: {
        referer: string;
        authorization?: string;
        apiKey: string;
    }) => {
        "Content-Type": string;
        "Accept-Language": string;
        "Accept-Encoding": string;
        Origin: string;
        Priority: string;
    };
};
export default _default;
//# sourceMappingURL=headerHelper.d.ts.map