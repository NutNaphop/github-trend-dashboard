import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopLanguagesChart from "@/components/dashboard/TopLanguagesChart";
import TopLanguageRanking from "@/components/dashboard/TopLanguageRanking";
import TrendingSection from "@/components/dashboard/TrendingSection";
import RepoCard from "@/components/dashboard/RepoCard";
import { githubRepoService } from "@/services/github.service";

export default async function Home() {
  // Fetch data server-side
  let topLanguages: any[] = [];
  let topRepos: any[] = [];

  try {
    topLanguages = await githubRepoService.getTopProgramingLanguage(100);
  } catch (error) {
    console.error("Failed to fetch top languages:", error);
  }

  try {
    topRepos = await githubRepoService.getTopRepositories(5);
  } catch (error) {
    console.error("Failed to fetch top repos:", error);
  }

  return (
    <main className="min-h-screen text-foreground selection:bg-blue-500/30">
      {/* Header Area: bg-[#010409] */}
      <div className="bg-[#010409] w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      {/* Section 1: Top Languages -> bg-[#0D1117] */}
      <section className="bg-background w-full py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Top Programming Language</h2>
            <p className="text-muted text-sm">Let's see what language it's on top</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <TopLanguagesChart data={topLanguages} />
            </div>
            <div>
              <TopLanguageRanking data={topLanguages} />
            </div>
          </div>
        </div>
      </section>

      {/* Desktop: Side-by-side layout */}
      <section className="hidden lg:block bg-card w-full py-10 border-y border-border-subtle/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Top Repository */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">Top Repository</h2>
                <p className="text-muted text-sm">Top 5 Repository that's on Top</p>
              </div>
              <div className="flex flex-col">
                {topRepos && topRepos.length > 0 ? (
                  topRepos.map((repo: any) => (
                    <RepoCard
                      key={repo.id}
                      owner={repo.owner.login}
                      repoName={repo.name}
                      description={repo.description}
                      language={repo.language}
                      stars={repo.stargazers_count}
                      forks={repo.forks_count}
                      lastUpdate={repo.updated_at}
                    />
                  ))
                ) : (
                  <div className="text-muted text-sm text-center py-8 border border-border-subtle rounded-lg bg-background">
                    No top repositories found or rate limit exceeded.
                  </div>
                )}
              </div>
            </div>

            {/* Trending Repository */}
            <div>
              <TrendingSection />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: Stacked with alternating colors */}
      <section className="lg:hidden bg-card w-full py-10 border-y border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Top Repository</h2>
            <p className="text-muted text-sm">Top 5 Repository that's on Top</p>
          </div>
          <div className="flex flex-col">
            {topRepos && topRepos.length > 0 ? (
              topRepos.map((repo: any) => (
                <RepoCard
                  key={repo.id}
                  owner={repo.owner.login}
                  repoName={repo.name}
                  description={repo.description}
                  language={repo.language}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                  lastUpdate={repo.updated_at}
                />
              ))
            ) : (
              <div className="text-muted text-sm text-center py-8 border border-border-subtle rounded-lg bg-background">
                No top repositories found or rate limit exceeded.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="lg:hidden bg-background w-full py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingSection />
        </div>
      </section>

      {/* Footer Area: bg-[#010409] */}
      <div className="bg-[#010409] w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </main>
  );
}
