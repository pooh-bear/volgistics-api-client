export declare const initReqHeaders: ({ referer, authorization }: {
    referer: string;
    authorization?: string;
}) => Record<string, string>;
export declare const postReqHeaders: ({ referer, authorization }: {
    referer: string;
    authorization?: string;
}) => {
    "Content-Type": string;
    "Accept-Language": string;
    "Accept-Encoding": string;
    Origin: string;
    Priority: string;
};
declare const _default: {
    initReqHeaders: ({ referer, authorization }: {
        referer: string;
        authorization?: string;
    }) => Record<string, string>;
    postReqHeaders: ({ referer, authorization }: {
        referer: string;
        authorization?: string;
    }) => {
        "Content-Type": string;
        "Accept-Language": string;
        "Accept-Encoding": string;
        Origin: string;
        Priority: string;
    };
};
export default _default;
