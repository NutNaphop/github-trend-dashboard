import { NextResponse } from "next/server";
import { githubRepoService, githubSearchService } from "@/services/github.service";
import { handleGithubError } from "@/utils/errorHandler";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get("period")

        if (period !== "daily" && period !== "weekly" && period !== "monthly") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Period must be `dialy', 'weekly', or 'monthly'"
                },
                {
                    status: 400
                }
            )
        }

        let trendingRepo = [];

        switch (period) {
            case "daily":
                trendingRepo = await githubRepoService.getTodayTrendingRepositories()
                break
            case "weekly":
                trendingRepo = await githubRepoService.getThisWeekTrendingRepositories()
                break
            case "monthly":
                trendingRepo = await githubRepoService.getThisMonthTrendingRepositories()
                break
        }

        return NextResponse.json({
            success: true,
            data: trendingRepo
        })

    } catch (error) {
        console.error("API Error:", error)
        return handleGithubError(error)
    }
}
