import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Loading() {
  return (
    <main className="min-h-screen text-foreground flex flex-col">
      {/* Header Area */}
      <div className="bg-[#010409] w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />
        </div>
      </div>

      {/* Section 1: Top Languages Chart Skeleton */}
      <section className="bg-background w-full py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[400px] bg-[#161B22] rounded-xl border border-border-subtle/30 animate-pulse flex flex-col items-center justify-center p-6">
            <div className="w-48 h-6 bg-[#30363d] rounded-md mb-8"></div>
            <div className="w-64 h-64 bg-[#30363d] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Section 2: Top Repository Skeleton */}
      <section className="bg-card w-full py-10 border-y border-border-subtle/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="w-40 h-7 bg-[#30363d] rounded-md mb-2 animate-pulse"></div>
            <div className="w-60 h-4 bg-[#30363d] rounded-md animate-pulse"></div>
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-[120px] bg-[#0D1117] border border-border-subtle rounded-lg animate-pulse p-4 flex flex-col justify-between">
                <div>
                   <div className="w-1/3 h-5 bg-[#30363d] rounded-md mb-3"></div>
                   <div className="w-full h-3 bg-[#30363d] rounded-md mb-2"></div>
                   <div className="w-4/5 h-3 bg-[#30363d] rounded-md"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                   <div className="w-1/4 h-4 bg-[#30363d] rounded-md"></div>
                   <div className="w-1/4 h-4 bg-[#30363d] rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <div className="bg-[#010409] w-full mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </main>
  );
}
