import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { githubRepoService } from "@/services/github.service";
import { Star, GitFork, Eye, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatSizeFromKB, formatCompactNumber } from "@/utils/formatters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo}` };
}
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

  // Helper to get YYYY-MM-DD from ISO string safely
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return dateString.substring(0, 10);
  };

  return (
    <main className="min-h-screen text-foreground selection:bg-blue-500/30 flex flex-col">
      <div className="bg-[#010409] w-full border-b border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      <section className="bg-[#0d1117] w-full flex-grow py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {errorMsg ? (
            <div className="text-center py-20 border border-border-subtle rounded-lg bg-[#161b22]">
              <h2 className="text-xl font-bold text-red-500 mb-2">Repository Not Found</h2>
              <p className="text-gray-400 text-sm">{errorMsg}</p>
              <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
                Return to Dashboard
              </Link>
            </div>
          ) : repoData ? (
            <div className="flex flex-col gap-10">
              {/* Header / Profile Section */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 relative rounded-full overflow-hidden border border-border-subtle/50 mb-2 shadow-sm">
                  <Image
                    src={repoData.owner.avatar_url}
                    alt={repoData.owner.login}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {repoData.name}
                  </h1>
                  <p className="text-gray-400 font-medium">
                    {repoData.owner.login}
                  </p>
                </div>

                {repoData.topics && repoData.topics.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {repoData.topics.map((topic: string) => (
                      <span key={topic} className="px-3 py-1 text-xs font-semibold bg-[#21262d] text-gray-300 rounded-full border border-[#30363d]">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Star</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{formatCompactNumber(repoData.stargazers_count)}</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Watch</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{formatCompactNumber(repoData.watchers_count)}</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <GitFork className="w-4 h-4" />
                    <span className="text-sm font-medium">Fork</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{formatCompactNumber(repoData.forks_count)}</span>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Issue</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{formatCompactNumber(repoData.open_issues_count)}</span>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">About</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {repoData.description || "No description provided for this repository."}
                </p>
              </div>

              {/* Technical Detail Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Technical Detail</h2>
                <ul className="text-gray-400 text-sm space-y-2.5">
                  <li><span className="text-gray-300">Language :</span> {repoData.language || "N/A"}</li>
                  <li><span className="text-gray-300">Size :</span> {formatSizeFromKB(repoData.size)}</li>
                  <li><span className="text-gray-300">License :</span> {repoData.license?.spdx_id || repoData.license?.name || "No License"}</li>
                  <li><span className="text-gray-300">Create at :</span> {formatDate(repoData.created_at)}</li>
                  <li><span className="text-gray-300">Update at :</span> {formatDate(repoData.updated_at)}</li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 pb-8">
                <Link
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto bg-[#21262d] hover:bg-[#30363d] text-white font-medium py-3.5 px-6 rounded-lg transition-colors border border-[#30363d]"
                >
                  Go to repository
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

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
