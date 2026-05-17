import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <main className="min-h-screen text-foreground selection:bg-blue-500/30 flex flex-col">
      <div className="bg-[#010409] w-full border-b border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      <section className="bg-[#0d1117] w-full flex-grow py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-10 animate-pulse">
            {/* Header / Profile Section Skeleton */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-[#30363d] rounded-full mb-2"></div>
              <div>
                <div className="w-48 h-8 bg-[#30363d] rounded-md mb-2 mx-auto"></div>
                <div className="w-32 h-4 bg-[#30363d] rounded-md mx-auto"></div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="w-16 h-6 bg-[#30363d] rounded-full"></span>
                ))}
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-4 bg-[#30363d] rounded-md mb-2"></div>
                  <div className="w-12 h-6 bg-[#30363d] rounded-md"></div>
                </div>
              ))}
            </div>

            {/* About Section Skeleton */}
            <div className="space-y-3">
              <div className="w-20 h-6 bg-[#30363d] rounded-md mb-3"></div>
              <div className="w-full h-4 bg-[#30363d] rounded-md"></div>
              <div className="w-5/6 h-4 bg-[#30363d] rounded-md"></div>
              <div className="w-4/6 h-4 bg-[#30363d] rounded-md"></div>
            </div>

            {/* Technical Detail Section Skeleton */}
            <div className="space-y-4">
              <div className="w-36 h-6 bg-[#30363d] rounded-md mb-3"></div>
              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-48 h-4 bg-[#30363d] rounded-md"></div>
                ))}
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="pt-4 pb-8">
              <div className="w-full max-w-[280px] mx-auto h-12 bg-[#30363d] rounded-lg"></div>
            </div>
          </div>
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
