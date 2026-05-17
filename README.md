# GitHub Trend Dashboard

> 🇹🇭 [อ่านภาษาไทย](./README-TH.md)

## 🔗 Links

- 📐 **Figma Design:** [Click Here](https://www.figma.com/design/cjKSGwavIBmz3hxJhCrqfD/Github-Trend-Dashboard?node-id=0-1&t=ANd0XHOR974VKZIW-1)
- 📝 **Planning & Research (Notion):** [Click Here](https://rawwalnut.notion.site/Github-Trend-Dashboard-3619a10bbb3a8038accbcf255b77ebcc?source=copy_link)
- 🧪 **API Testing (Bruno):** [Click Here](./bruno)

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| API Client | Octokit (GitHub REST API) |
| Icons | Lucide React |

---

## 🚀 Setup & Run

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token ([Create one here](https://github.com/settings/tokens))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NutNaphop/github-trend-dashboard.git
cd github-trend-dashboard

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with your GitHub token:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🧠 Product Thinking

### Who is this dashboard designed for?

This dashboard is designed for **developers and tech enthusiasts** who want to quickly explore trending technologies on GitHub. The UI is intentionally designed to feel familiar to GitHub users in order to reduce cognitive load and allow users to understand the interface in a short time by:

- Removing unnecessary UI elements
- Designing UI that resembles GitHub's own aesthetic
- Adopting a Mobile First approach for efficient development

### How is "Top Programming Language" defined?

We determine top languages by analyzing the **primary language** of the top 100 most-starred repositories on GitHub, sorted from highest to lowest stars.

**Why 100 and not 1,000?**
Fetching 1,000 repos would require 10 API calls per user. Even with caching, we could only serve about 3 users per minute before hitting GitHub's rate limit. With 100 repos (1 API call), we can comfortably serve ~29-30 users per minute.

Stars indicate community interest and endorsement. The top-starred repos represent the highest quality and most popular projects of all time.

**Filtering strategy:**
Some top repos don't represent programming languages (e.g., awesome lists, book collections). We filter these out to produce clean data:

- Exclude forked repositories
- Exclude archived repositories
- Remove repos with topics like `awesome`, `list`, `books`
- Pull the top 100 repos sorted by stars (descending)
- Count each primary language and display the top 10 as a Donut Chart

We chose a Donut Chart because it best represents proportional data out of 100%, making it easy to see the overall landscape at a glance.

```
GET /search/repositories?q=stars:>1000 fork:false archived:false -topic:awesome -topic:list -topic:books&per_page=100&sort=stars&order=desc
```

### How is "Top Repository" defined?

Defined by the all-time highest number of stars, sorted descending, showing the top 5 repositories. We intentionally limit to 5 to provide a quick, clear overview rather than an overwhelming list.

Unlike Top Languages, we only filter out archived repos here. Top Repository includes all types of projects (documentation, tools, code) to show who the true frontrunners are.

```
GET /search/repositories?q=stars:>1 archived:false&per_page=5&sort=stars&order=desc
```

### How is "Trending Repository" defined?

Defined by repositories **created within a specific timeframe** that have rapidly gained stars, split into 3 categories:

| Period | Star Threshold | Rationale |
|---|---|---|
| **Today** | > 10 stars | Getting 10 stars in a single day is already very notable |
| **This Week** | > 100 stars | Averages ~14 stars/day, indicating strong traction |
| **This Month** | > 1,000 stars | Shows explosive growth — truly viral projects |

**Timezone handling:** We use ISO date format for simplicity, but encountered the UTC offset issue (JavaScript's `toISOString()` converts to UTC+0, causing date mismatches in Thailand and other time zones). We solved this by reading the machine's timezone offset, then subtracting it from the ISO time to get the correct local date.

```
# Today
GET /search/repositories?q=created:>=2026-05-17 stars:>10 fork:false archived:false&per_page=5&sort=stars&order=desc

# This Week
GET /search/repositories?q=created:2026-05-11..2026-05-17 stars:>100 fork:false archived:false&per_page=5&sort=stars&order=desc

# This Month
GET /search/repositories?q=created:2026-05-01..2026-05-31 stars:>1000 fork:false archived:false&per_page=5&sort=stars&order=desc
```

---

## 🔌 API Endpoints Used

### 1. List Repositories for User

```
GET /users/{username}/repos
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-list-for-user
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
- **Used for:** User search
- **Why:** Provides more accurate results than the Search API with `user:` query, which treats User and Organization identically.

### 2. List Repositories for Organization

```
GET /orgs/{org}/repos
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-list-for-org
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#list-organization-repositories
- **Used for:** Organization search
- **Why:** Same reason as above — dedicated endpoint gives more precise results for org-specific queries.

### 3. Search Repositories

```
GET /search/repositories
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#search-repos
- **GitHub REST Doc:** https://docs.github.com/en/rest/search/search#search-repositories
- **Used for:** Top Languages, Top Repositories, Trending (Today/Week/Month), Repository Name search
- **Why:** The search endpoint's powerful query syntax (`stars:>`, `created:>=`, `fork:false`, `archived:false`, `-topic:`) allows us to filter, sort, and aggregate data precisely within a single API call.

### 4. Get Repository

```
GET /repos/{owner}/{repo}
```

- **Octokit Doc:** https://octokit.github.io/rest.js/v22/#repos-get
- **GitHub REST Doc:** https://docs.github.com/en/rest/repos/repos#get-a-repository
- **Used for:** Full Repository search (detail page)
- **Why:** Provides exhaustive metadata (size, license, topics, dates) for a specific repository. While the Search API could work, a dedicated endpoint is more appropriate for single-resource lookups.

---

## 💡 Improvement

If I had more time, I would improve the following:

- **Design Token System:** Create a centralized design token system for consistent styling across the application. This would make it easier to scale and maintain the UI as features grow.
- **Enhanced Detail Page:** Add more detailed information to the repository detail page, such as rendering the repository's README or showing contributor stats. Currently, the detail page shows essential info and links to the actual repo — sufficient, but could be richer.
- **Accurate Search Result Count for User/Org:** The current `totalItems` for User/Org searches is estimated from `totalPages × limit`, which can be slightly inaccurate (the last page may not be full). A more precise solution could be implemented with additional API calls or alternative counting strategies.
