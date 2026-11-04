import { Header } from "./components/Header";
import { Music, ShieldCheck, Truck, Headphones } from "lucide-react";

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header with API Status */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
            <Music className="w-4 h-4" />
            <span>Campo Grande - MS • Since 2008</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Sua música começa aqui com{" "}
            <span className="text-amber-400">Inteligência Artificial</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Explore our exclusive collection of musical instruments, check order
            statuses instantly, and talk with our AI assistant.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#catalog"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center"
            >
              Browse Instruments
            </a>
            <a
              href="#chat"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl border border-slate-700 transition-all text-center"
            >
              Talk to AI Assistant
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl flex items-start space-x-4">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Fast Delivery
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Free shipping in Campo Grande for orders over R$ 500.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl flex items-start space-x-4">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Official Warranty
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                90-day statutory warranty plus manufacturer guarantees.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl flex items-start space-x-4">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Expert Support
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                AI customer assistant available 24/7 to answer your questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
        <p>
          © 2008–2026 Empório da Música Instrumentos Musicais Ltda. All rights
          reserved.
        </p>
        <p className="mt-2 text-xs">
          Rua 14 de Maio, 3200 — Centro, Campo Grande/MS
        </p>
      </footer>
    </div>
  );
}

export default App;
