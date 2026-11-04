import { Header } from "./components/Header";

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header Component Test */}
      <Header />

      {/* Temporary container to test styling */}
      <main className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-amber-400">Header Test Page</h2>
        <p className="text-slate-400 mt-2">
          If you see the dark background, golden accents, and working API status
          above, the Tailwind CSS is working perfectly!
        </p>
      </main>
    </div>
  );
}

export default App;
