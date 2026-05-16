import { NextResponse } from "next/server";
import { githubSearchService } from "@/services/github.service";
import { handleGithubError } from "@/utils/errorHandler";

export async function GET(
    request: Request,
    context: { params: Promise<{ owner: string; repo: string }> }
) {
    try {
        const { owner, repo } = await context.params;
        const repoInfo = await githubSearchService.serchFullName(owner, repo);
        return NextResponse.json({ success: true, data: repoInfo });

    } catch (error) {
        console.error("API Error:", error);
        return handleGithubError(error)
    }
}
