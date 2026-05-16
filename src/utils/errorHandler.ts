// src/utils/errorHandler.ts
import { NextResponse } from "next/server";

export const handleGithubError = (error: any) => {
    const status = error?.status || 500;
    let message = "Internal Server Error";

    switch (status) {
        case 401:
            message = "Unauthorized: GitHub Token is not valid.";
            break;
        case 403:
            message = "Rate Limit Exceeded: Quota has reach a limit. Try again next time";
            break;
        case 404:
            message = "Not Found: No data found";
            break;
        case 422:
            message = "Unprocessable Entity: Wrong pattern or parameter";
            break;
        default:
            message = error?.message || "Unknow error";
    }

    return NextResponse.json(
        {
            success: false,
            message: message,
            rateLimitReset: error?.response?.headers?.["x-ratelimit-reset"] || null
        },
        { status: status === 403 ? 429 : status }
    );
};
