"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"users" | "repositories" | "full_name">("repositories");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    // 1. Invalid search input validation
    if (!trimmedQuery) {
      setError("Please enter a valid search term.");
      return;
    }
    setError("");

    // 2. Explicit Routing based on Dropdown
    if (searchType === "full_name") {
      if (!trimmedQuery.includes("/")) {
        setError("Please enter in owner/repo format (e.g., facebook/react)");
        return;
      }
      const parts = trimmedQuery.split("/");
      if (parts.length >= 2 && parts[0] && parts[1]) {
        router.push(`/repository/${parts[0]}/${parts[1]}`);
        return;
      } else {
        setError("Invalid format. Use owner/repo (e.g., facebook/react)");
        return;
      }
    }

    // 3. Normal Search: Route to Search Results page with Type
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}&type=${searchType}`);
  };

  const getPlaceholder = () => {
    if (searchType === "full_name") return "Search owner/repo (e.g. facebook/react)...";
    if (searchType === "users") return "Search user/org (e.g. vercel)...";
    return "Search repos (e.g. react)...";
  };
  return (
    <header className="flex flex-col items-center justify-center pt-10 pb-6 space-y-4">
      {/* Logo and Title */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-[#0D1117]"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Github Trend
        </h1>
        <p className="text-muted text-sm font-medium">
          Discovery a trend & languages
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-lg px-4 mt-6">
        <form onSubmit={handleSearch} className="relative flex items-center w-full h-12 rounded-full bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
          <select
            className="h-full bg-transparent text-sm font-semibold text-gray-700 outline-none border-none pr-2 cursor-pointer"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "users" | "repositories" | "full_name")}
          >
            <option value="repositories">Repository Name</option>
            <option value="users">User / Org</option>
            <option value="full_name">Full Repository</option>
          </select>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <input
            className="w-full h-full text-black bg-transparent outline-none placeholder:text-gray-400 text-sm font-medium"
            type="text"
            placeholder={getPlaceholder()}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(""); // Clear error when typing
            }}
          />
        </form>
        {error && (
          <p className="text-red-500 text-xs text-center mt-2 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    </header>
  );
}
