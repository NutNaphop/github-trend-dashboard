import { NextResponse } from "next/server";
import { githubSearchService } from "@/services/github.service";
import { handleGithubError } from "@/utils/errorHandler";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const keyword = searchParams.get("q")
        const type = searchParams.get("type") || "repositories"
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = 10

        if (!keyword) {
            return NextResponse.json(
                { success: false, message: "Keyword is required" },
                { status: 400 }
            )
        }

        let results: { items: any[]; totalCount: number } = { items: [], totalCount: 0 };

        if (type === "users") {
            results = await githubSearchService.searchUsers(keyword, page, limit);
        } else {
            results = await githubSearchService.searchRepository(keyword, page, limit);
        }

        const finalRepos = results.items;

        // Calculate total pages (GitHub limits results to top 1000 items maximum)
        const maxGithubResults = 1000;
        const actualTotal = Math.min(results.totalCount, maxGithubResults);
        const totalPages = Math.ceil(actualTotal / limit);

        return NextResponse.json({
            success: true,
            data: finalRepos,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: results.totalCount // original un-capped count for display
            }

        })
    } catch (error) {
        console.error("Aggregated Search API Error:", error)
        return handleGithubError(error)
    }
}
