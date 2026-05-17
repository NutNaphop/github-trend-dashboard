"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import RepoCard from "../dashboard/RepoCard";
import StateWrapper from "../ui/StateWrapper";
import Pagination from "../ui/Pagination";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "repositories";
  const pageParam = searchParams.get("page") || "1";

  const [repos, setRepos] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${pageParam}`);
        const json = await response.json();
        
        if (!response.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch search results");
        }
        
        setRepos(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type, pageParam]);

  if (!query) {
    return (
      <div className="text-center py-20 border border-border-subtle rounded-lg bg-card">
        <h2 className="text-xl font-bold text-white mb-2">No search query provided</h2>
        <p className="text-muted text-sm">Please type something in the search bar above.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      <div className="mb-6 pb-4 border-b border-border-subtle/30 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Search Results for "{query}"
          </h2>
          <p className="text-muted text-sm mt-1">
            Showing {type === "user" ? "repositories owned by this user" : type === "org" ? "repositories owned by this organization" : "repositories matching this name"}
          </p>
        </div>
        {!loading && pagination.totalItems > 0 && (
          <div className="text-sm text-muted">
            {pagination.totalItems.toLocaleString()} results
          </div>
        )}
      </div>

      <StateWrapper
        isLoading={loading}
        error={error}
        isEmpty={repos.length === 0}
        emptyMessage={`No repositories found for "${query}". Try searching for something else.`}
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
        
        {!loading && repos.length > 0 && pagination.totalPages > 1 && (
          <Pagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
          />
        )}
      </StateWrapper>
    </div>
  );
}
