import { ArrowDown, MessageCircle } from "lucide-react";

const heroImageUrl =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=90";

export const Hero = () => {
  const openAssistant = () => {
    window.dispatchEvent(new Event("emporium:open-assistant"));
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="mb-12 grid overflow-hidden rounded-3xl border border-[#c99545]/25 bg-[#f4f0e8] shadow-2xl shadow-black/15 lg:min-h-[470px] lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c99545]/35 bg-[#e9e2d6] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a622d]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c99545]" />
          Empório da Música
        </span>
        <h1
          id="hero-title"
          className="max-w-xl text-4xl font-black leading-[1.08] tracking-tight text-[#181815] sm:text-5xl lg:text-6xl"
        >
          Your Music
          <br />
          Starts <span className="text-[#c99545]">Here</span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#756f64] sm:text-lg">
          Discover the right instrument for your sound.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#catalog"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#181815] px-5 py-3 text-sm font-bold text-[#fffdf8] shadow-lg shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#302e27] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
          >
            Explore Instruments
            <ArrowDown className="h-4 w-4 text-[#e7b25d]" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={openAssistant}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#181815]/20 bg-[#fffdf8]/70 px-5 py-3 text-sm font-bold text-[#181815] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c99545] hover:bg-[#fffdf8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c99545]"
          >
            <MessageCircle
              className="h-4 w-4 text-[#a8752e]"
              aria-hidden="true"
            />
            Talk to Our Assistant
          </button>
        </div>
      </div>

      <div className="relative min-h-64 overflow-hidden bg-[#181815] sm:min-h-80 lg:min-h-full">
        <img
          src={heroImageUrl}
          alt="Musician playing guitar in a recording studio"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#181815]/45 via-[#181815]/10 to-transparent lg:from-[#181815]/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#181815]/35 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-5 left-5 h-12 w-12 rounded-full border border-[#e7b25d]/70 sm:bottom-8 sm:left-8 sm:h-16 sm:w-16">
          <span className="absolute inset-2 rounded-full border border-[#fffdf8]/50" />
        </div>
      </div>
    </section>
  );
};
