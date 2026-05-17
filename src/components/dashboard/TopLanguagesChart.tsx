"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getLanguageColor } from "@/utils/colors";

export interface TopLanguagesChartProps {
  data: { language: string; count: number }[];
}

export default function TopLanguagesChart({ data }: TopLanguagesChartProps) {
  // If no data, show a fallback
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-card border border-border-subtle rounded-xl p-6 flex items-center justify-center h-[300px]">
        <p className="text-muted">No language data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-card border border-border-subtle rounded-xl p-6">
        {/* Custom Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center text-xs font-medium">
              <span
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: getLanguageColor(entry.language) }}
              ></span>
              <span className="text-white">{entry.language}</span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="w-full h-[250px] sm:h-[300px] flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="90%"
                stroke="none"
                dataKey="count"
                nameKey="language"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getLanguageColor(entry.language)}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161B22",
                  border: "1px solid #30363D",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
