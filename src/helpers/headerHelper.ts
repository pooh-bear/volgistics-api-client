const initialRequestHeaders = {
    "Accept": "application/json, text/plain, */*",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "X-API-Key": "6wRWFhd.aVNctG6h4Y5f4Kp4furHA4CypFdSrtE7",
} 

export const initReqHeaders = ({ referer, authorization }: { referer: string; authorization?: string }) => {
    let headers = {
        ...initialRequestHeaders,
        "Referer": referer,
    };

    if (authorization) {
        headers["Authorization"] = authorization;
    }

    return headers;
}

export const postReqHeaders = ({ referer, authorization }: { referer: string; authorization?: string }) => {
    return {
        ...initReqHeaders({ referer, authorization }),
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