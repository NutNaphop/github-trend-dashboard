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

        let finalRepos: any[] = [];
        let totalPages = 1;
        let totalItems = 0;

        if (type === "user") {
            const result = await githubSearchService.searchByUser(keyword, page, limit);
            finalRepos = result.items;
            totalPages = result.totalPages;
            totalItems = result.items.length > 0 ? result.totalPages * limit : 0; // Estimate
        } else if (type === "org") {
            const result = await githubSearchService.searchByOrg(keyword, page, limit);
            finalRepos = result.items;
            totalPages = result.totalPages;
            totalItems = result.items.length > 0 ? result.totalPages * limit : 0; // Estimate
        } else {
            const result = await githubSearchService.searchRepository(keyword, page, limit);
            finalRepos = result.items;
            // Calculate total pages (GitHub limits results to top 1000 items maximum)
            const maxGithubResults = 1000;
            const actualTotal = Math.min(result.totalCount, maxGithubResults);
            totalPages = Math.ceil(actualTotal / limit);
            totalItems = result.totalCount;
        }

        return NextResponse.json({
            success: true,
            data: finalRepos,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems
            }

        })
    } catch (error) {
        console.error("Aggregated Search API Error:", error)
        return handleGithubError(error)
    }
}
