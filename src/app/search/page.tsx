import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchResults from "@/components/search/SearchResults";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen text-foreground selection:bg-blue-500/30">
      {/* Header Area: bg-[#010409] */}
      <div className="bg-[#010409] w-full border-b border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      {/* Main Content Area: bg-[#0D1117] */}
      <section className="bg-background w-full py-10 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex justify-center items-center py-20 text-blue-500">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
      </section>

      {/* Footer Area: bg-[#010409] */}
      <div className="bg-[#010409] w-full border-t border-border-subtle/30 mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </main>
  );
}
