import { formatToLocalISO } from "@/utils/dateUtils";
import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

// === REPO FUNCTION SERVICE==
const githubRepoService = {
    getTopProgramingLanguage: async (limit = 100) => {
        try {
            const response = await octokit.rest.search.repos({
                q: "stars:>1000 fork:false archived:false",
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            const repos = response.data.items

            const languageCounts: Record<string, number> = {}

            repos.forEach((repo) => {
                const lang = repo.language
                if (lang) {
                    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                }
            })

            // Object top Arrat then desc
            const sortedLanguages = Object.entries(languageCounts)
                .map(([language, count]) => ({ language, count }))
                .sort((a, b) => b.count - a.count);
            return sortedLanguages.slice(0, 10);
        } catch (error) {
            console.log("Error in getTopProgramingLanguage")
            throw error
        }
    },

    getTopRepositories: async (limit = 5) => {
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
    },

    getTodayTrendingRepositories: async (limit = 10) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0)
        const fromDate = formatToLocalISO(today)
        try {
            const response = await octokit.rest.search.repos({
                q: `created:>${fromDate} stars:>10 forks:false achived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            return response.data.items;
        } catch (error) {
            console.log("Error fetching trending repositories", error)
            throw error
        }
    },

    getThisWeekTrendingRepositories: async (limit = 10) => {
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
                q: `created:${fromDate}..${toDate} stars:>10 forks:false achived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })

            return response.data.items
        } catch (error) {
            console.log("Error fetching this week trending repositories:", error)
            throw error
        }
    },

    getThisMonthTrendingRepositories: async (limit = 10) => {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        startOfMonth.setHours(0, 0, 0, 0)
        endOfMonth.setHours(0, 0, 0, 0)
        const fromStart = formatToLocalISO(startOfMonth)
        const toEnd = formatToLocalISO(endOfMonth)

        try {
            const response = await octokit.rest.search.repos({
                q: `created:${fromStart}..${toEnd} stars:>10 forks:false achived:false`,
                sort: "stars",
                order: "desc",
                per_page: limit
            })
            return response.data.items
        } catch (error) {
            throw error
        }
    },
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