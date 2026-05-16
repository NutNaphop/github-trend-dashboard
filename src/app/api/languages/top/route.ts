import { githubRepoService } from "@/services/github.service";
import { handleGithubError } from "@/utils/errorHandler";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const topProg = await githubRepoService.getTopProgramingLanguage()
        return NextResponse.json({
            success: true,
            data: topProg
        })
    } catch (error) {
        console.error("API Error:", error)
        return handleGithubError(error)
    }
}