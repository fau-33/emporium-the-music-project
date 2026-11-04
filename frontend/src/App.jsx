import { Header } from "./components/Header";
import { ProductGrid } from "./components/ProductGrid";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { Sparkles } from "lucide-react";

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Hero />
        <Categories />
        <section id="catalog" aria-labelledby="catalog-title">
          <div className="mb-8 text-center sm:text-left">
            <div className="mb-3 inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Catalog • Direct from Backend</span>
            </div>
            <h2
              id="catalog-title"
              className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            >
              Musical Instruments Available
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Fetched in real-time from our FastAPI backend service.
            </p>
          </div>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
