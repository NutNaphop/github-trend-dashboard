"use client";

import { useState, useEffect } from "react";
import RepoCard from "./RepoCard";
import StateWrapper from "../ui/StateWrapper";

type Period = "daily" | "weekly" | "monthly";

export default function TrendingSection() {
  const [period, setPeriod] = useState<Period>("daily");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/repos/trending?period=${period}`);
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch trending repos");
        }

        setRepos(json.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [period]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-white">Trending Repository</h2>
          <p className="text-muted text-sm">Top 5 Repository that's on Trend</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex w-full sm:w-auto bg-card border border-border-subtle rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${period === p
                ? "bg-blue-600 text-white"
                : "text-muted hover:text-white"
                }`}
            >
              {p === "daily" ? "Daily" : p === "weekly" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-transparent">
        <StateWrapper
          isLoading={loading}
          error={error}
          isEmpty={repos.length === 0}
          emptyMessage="No trending repositories found."
        >
          <div className="flex flex-col">
            {repos.map((repo) => (
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
            ))}
          </div>
        </StateWrapper>
      </div>
    </div>
  );
}
