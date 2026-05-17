import { BookOpen, Star, GitFork, ChevronRight } from "lucide-react";
import { getLanguageColor } from "@/utils/colors";
import Link from "next/link";

export interface RepoCardProps {
  owner: string;
  repoName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdate: string;
}

export default function RepoCard({
  owner,
  repoName,
  description,
  language,
  stars,
  forks,
  lastUpdate,
}: RepoCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  return (
    <Link href={`/repository/${owner}/${repoName}`} className="bg-card border border-border-subtle rounded-lg p-4 mb-3 flex flex-col hover:border-gray-500 transition-colors cursor-pointer group block">
      <div className="flex items-start justify-between">
        <div className="flex items-center text-blue-400 font-semibold text-sm sm:text-base min-w-0 pr-4">
          <BookOpen className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
          <span className="truncate">
            {owner} <span className="text-gray-400">/</span> {repoName}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors shrink-0" />
      </div>

      <p className="text-muted text-xs sm:text-sm mt-2 mb-4 line-clamp-2">
        {description || "No description provided."}
      </p>

      <div className="flex items-center justify-between text-muted text-xs sm:text-sm mt-auto">
        <div className="flex items-center space-x-4">
          {/* Language */}
          <div className="flex items-center">
            <span
              className="w-2.5 h-2.5 rounded-full mr-1.5"
              style={{ backgroundColor: getLanguageColor(language) }}
            ></span>
            <span>{language || "Unknown"}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            <span>{formatNumber(stars)}</span>
          </div>

          {/* Forks */}
          <div className="flex items-center hidden sm:flex">
            <GitFork className="w-4 h-4 mr-1" />
            <span>{formatNumber(forks)}</span>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-right">
          Last update {formatDate(lastUpdate)}
        </div>
      </div>
    </Link>
  );
}
