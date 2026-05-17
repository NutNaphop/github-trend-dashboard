"use client";

import { getLanguageColor } from "@/utils/colors";

interface TopLanguageRankingProps {
  data: { language: string; count: number }[];
}

export default function TopLanguageRanking({ data }: TopLanguageRankingProps) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex flex-col gap-3">
      {data.slice(0, 3).map((entry, index) => {
        const percentage = ((entry.count / total) * 100).toFixed(1);
        return (
          <div
            key={`rank-${index}`}
            className="flex items-center gap-3 bg-card border border-border-subtle rounded-lg p-4"
          >
            <span className="text-2xl">{medals[index]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getLanguageColor(entry.language) }}
                ></span>
                <span className="text-white font-semibold text-sm truncate">{entry.language}</span>
              </div>
              <div className="text-muted text-xs mt-1">{entry.count} repos · {percentage}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
