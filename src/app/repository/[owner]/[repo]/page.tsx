import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { githubRepoService } from "@/services/github.service";
import { Star, GitFork, Eye, AlertCircle, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default async function RepositoryDetailPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  let repoData = null;
  let errorMsg = null;

  try {
    repoData = await githubRepoService.getRepository(owner, repo);
  } catch (error: any) {
    errorMsg = error.message || "Failed to load repository details.";
  }

  return (
    <main className="min-h-screen text-foreground selection:bg-blue-500/30">
      <div className="bg-[#010409] w-full border-b border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      <section className="bg-background w-full py-10 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {errorMsg ? (
            <div className="text-center py-20 border border-border-subtle rounded-lg bg-card">
              <h2 className="text-xl font-bold text-red-500 mb-2">Repository Not Found</h2>
              <p className="text-muted text-sm">{errorMsg}</p>
              <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
                Return to Dashboard
              </Link>
            </div>
          ) : repoData ? (
            <div className="bg-card border border-border-subtle rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-muted" />
                    <h1 className="text-2xl font-bold text-blue-500 hover:underline">
                      <a href={repoData.html_url} target="_blank" rel="noopener noreferrer">
                        {repoData.full_name}
                      </a>
                    </h1>
                    <span className="px-2 py-0.5 text-xs font-medium bg-transparent border border-border-subtle text-muted rounded-full ml-2">
                      {repoData.visibility}
                    </span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed max-w-2xl">
                    {repoData.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted">
                {repoData.language && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>{repoData.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4" />
                  <span>{repoData.stargazers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4" />
                  <span>{repoData.forks_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{repoData.watchers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{repoData.open_issues_count.toLocaleString()} issues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(repoData.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              {repoData.topics && repoData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {repoData.topics.map((topic: string) => (
                    <span key={topic} className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <div className="bg-[#010409] w-full border-t border-border-subtle/30 mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </main>
  );
}
