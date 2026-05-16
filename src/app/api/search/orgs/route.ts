import { NextResponse } from "next/server";
import { githubSearchService } from "@/services/github.service";
import { handleGithubError } from "@/utils/errorHandler";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const keyword = searchParams.get("keyword")

        if (!keyword) {
            return NextResponse.json(
                {
                    sucess: false,
                    message: "Keyword is required"
                },
                {
                    status: 400
                }
            )
        }

        const orgRepo = await githubSearchService.searchOrg(keyword)
        return NextResponse.json({
            success: true,
            data: orgRepo
        })
    } catch (error) {
        console.error("API Error:", error)
        return handleGithubError(error)
    }
}