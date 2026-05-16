// src/utils/errorHandler.ts
import { NextResponse } from "next/server";

export const handleGithubError = (error: any) => {
    const status = error?.status || 500;
    let message = "Internal Server Error";

    switch (status) {
        case 401:
            message = "Unauthorized: GitHub Token ไม่ถูกต้อง หรือหมดอายุ";
            break;
        case 403:
            message = "Rate Limit Exceeded: โควต้าการดึงข้อมูลจาก GitHub เต็มแล้ว กรุณารอสักครู่";
            break;
        case 404:
            message = "Not Found: ไม่พบข้อมูล Repository หรือ User ที่คุณค้นหา";
            break;
        case 422:
            message = "Unprocessable Entity: คำค้นหาไม่ถูกต้อง หรือส่ง Parameter ไปผิดรูปแบบ";
            break;
        default:
            message = error?.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
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
