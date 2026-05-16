import { formatToLocalISO } from "@/utils/dateUtils";
import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

// === REPO FUNCTION SERVICE==
const githubRepoService = {
    getTopProgramingLanguage: unstable_cache(async (limit = 100) => {
        try {
            let repos: any[] = [];
            const maxPages = Math.ceil(limit / 100);

            for (let page = 1; page <= maxPages; page++) {
                const response = await octokit.rest.search.repos({
                    q: "stars:>1000 fork:false archived:false -topic:awesome -topic:list -topic:books",
                    sort: "stars",
                    order: "desc",
                    per_page: 100,
                    page: page
                });
                repos.push(...response.data.items);

                // Break early if we reached the end of results
                if (response.data.items.length < 100) break;
            }

            // ตัดให้เหลือเท่า limit (เผื่อกรณีมันเกิน)
            repos = repos.slice(0, limit);

            const languageCounts: Record<string, number> = {}

            repos.forEach((repo) => {
                const lang = repo.language
                if (lang) {
                    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                }
            })

            // Object top Array then desc
            const sortedLanguages = Object.entries(languageCounts)
                .map(([language, count]) => ({ language, count }))
                .sort((a, b) => b.count - a.count);
            return sortedLanguages.slice(0, 10);
        } catch (error) {
            console.log("Error in getTopProgramingLanguage")
            throw error
        }
    }, ['top-languages'], { revalidate: 3600 }), // Cache 1 ชั่วโมง

    getTopRepositories: unstable_cache(async (limit = 5) => {
        try {
            const response = await octokit.rest.search.repos({
                q: "stars:>1 archived:false",
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            return response.data.items;
        } catch (error) {
            console.log("Error fetching top repositories:", error);
            throw error
        }
    }, ['top-repos'], { revalidate: 3600 }),

    getTodayTrendingRepositories: unstable_cache(async (limit = 5) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0)
        const fromDate = formatToLocalISO(today)
        try {
            const response = await octokit.rest.search.repos({
                q: `created:>=${fromDate} stars:>10 fork:false archived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            return response.data.items;
        } catch (error) {
            console.log("Error fetching trending repositories", error)
            throw error
        }
    }, ['trending-today'], { revalidate: 3600 }),

    getThisWeekTrendingRepositories: unstable_cache(async (limit = 5) => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(0, 0, 0, 0)

        const fromDate = formatToLocalISO(startOfWeek)
        const toDate = formatToLocalISO(endOfWeek)

        try {
            const response = await octokit.rest.search.repos({
                q: `created:${fromDate}..${toDate} stars:>10 fork:false archived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            return response.data.items
        } catch (error) {
            console.log("Error fetching this week trending repositories:", error)
            throw error
        }
    }, ['trending-week'], { revalidate: 3600 }),

    getThisMonthTrendingRepositories: unstable_cache(async (limit = 5) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startOfMonth.setHours(0, 0, 0, 0)
        endOfMonth.setHours(0, 0, 0, 0)
        const fromStart = formatToLocalISO(startOfMonth)
        const toEnd = formatToLocalISO(endOfMonth)

        try {
            const response = await octokit.rest.search.repos({
                q: `created:${fromStart}..${toEnd} stars:>10 fork:false archived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })
            return response.data.items
        } catch (error) {
            throw error
        }
    }, ['trending-month'], { revalidate: 3600 }),
}

// === SEARCH FUNCTION SERVICE==
const githubSearchService = {
    searchUsers: async (keyword: string) => {
        try {
            const response = await octokit.rest.search.repos({
                q: `user:${keyword}`
            })
            return response.data.items
        } catch (error) {
            throw error
        }

    },

    searchOrg: async (keyword: string) => {
        try {
            const response = await octokit.rest.search.repos({
                q: `org:${keyword}`
            })
            return response.data.items
        } catch (error) {
            throw error
        }
    },

    serchFullName: async (owner: string, repo: string) => {
        try {
            const response = await octokit.rest.search.repos({
                q: `repo:${owner}/${repo}`
            })
            return response.data.items
        } catch (error) {
            throw error
        }
    },

    searchRepository: async (keyword: string) => {
        try {
            const response = await octokit.rest.search.repos({
                q: `${keyword} in:name`
            })
            return response.data.items
        } catch (error) {
            throw error
        }
    }
}

export { githubRepoService, githubSearchService }