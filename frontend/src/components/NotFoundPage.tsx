import { ArrowLeft, ArrowUpRight, Music2 } from "lucide-react";

export const NotFoundPage = () => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-16 text-slate-100">
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 h-[min(85vw,38rem)] w-[min(85vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.07] blur-3xl"
      aria-hidden="true"
    />

    <div className="relative w-full max-w-3xl text-center">
      <a
        href="/"
        className="mx-auto mb-12 inline-flex items-center gap-2 rounded-full text-sm font-bold tracking-[0.14em] text-amber-300 transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        aria-label="Empório da Música home"
      >
        <Music2 className="h-5 w-5" aria-hidden="true" />
        EMPÓRIO DA MÚSICA
      </a>

      <div
        className="relative mx-auto mb-7 flex h-36 w-56 items-center justify-center sm:h-44 sm:w-72"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-amber-500/15" />
        <div className="absolute inset-4 rounded-full border border-amber-500/10" />
        <div className="absolute inset-8 rounded-full border border-amber-500/10" />
        <Music2 className="h-14 w-14 text-amber-400 drop-shadow-[0_0_24px_rgba(251,191,36,0.35)] sm:h-16 sm:w-16" />
        <span className="absolute left-5 top-6 text-2xl text-amber-300/70 sm:left-8 sm:top-8">
          ♪
        </span>
        <span className="absolute bottom-5 right-6 text-3xl text-amber-300/60 sm:bottom-7 sm:right-9">
          ♫
        </span>
      </div>

      <p className="text-[clamp(6rem,24vw,12rem)] font-black leading-[0.8] tracking-[-0.08em] text-amber-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]">
        404
      </p>
      <h1 className="mx-auto mt-8 max-w-xl text-xl font-bold leading-snug text-white sm:text-2xl">
        Oops! Parece que essa página saiu do tom.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
        The page you’re looking for isn’t part of our set. Let’s get you back to
        the music.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="/"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </a>
        <a
          href="/#catalog"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:w-auto"
        >
          Explore Instruments
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </main>
);
