const baseHeaders = (apiKey: string) => ({
    "Accept": "application/json, text/plain, */*",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "X-API-Key": apiKey,
});

export const initReqHeaders = ({ referer, authorization, apiKey }: { referer: string; authorization?: string; apiKey: string }) => {
    let headers: Record<string, string> = {
        ...baseHeaders(apiKey),
        "Referer": referer,
    };

    if (authorization) {
        headers["Authorization"] = authorization;
    }

    return headers;
}

export const postReqHeaders = ({ referer, authorization, apiKey }: { referer: string; authorization?: string; apiKey: string }) => {
    return {
        ...initReqHeaders({ referer, authorization, apiKey }),
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Origin": "https://www.volgistics.com",
        "Priority": "u=3, i",
    };
}

export default {
    initReqHeaders,
    postReqHeaders
}