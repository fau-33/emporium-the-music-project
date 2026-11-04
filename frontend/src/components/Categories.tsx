import {
  AudioLines,
  Drum,
  Guitar,
  GuitarElectric,
  Music,
  Piano,
  Wind,
  type LucideIcon,
} from "lucide-react";

interface Category {
  id: number;
  sourceName: string;
  name: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  {
    id: 1,
    sourceName: "Guitarras",
    name: "Electric Guitars",
    icon: GuitarElectric,
  },
  { id: 2, sourceName: "Baixos", name: "Basses", icon: AudioLines },
  {
    id: 3,
    sourceName: "Baterias e Percussão",
    name: "Drums & Percussion",
    icon: Drum,
  },
  {
    id: 4,
    sourceName: "Teclados e Pianos",
    name: "Keyboards & Pianos",
    icon: Piano,
  },
  { id: 5, sourceName: "Violões", name: "Acoustic Guitars", icon: Guitar },
  {
    id: 6,
    sourceName: "Instrumentos de Sopro (Madeiras)",
    name: "Woodwind Instruments",
    icon: Wind,
  },
  {
    id: 7,
    sourceName: "Instrumentos de Sopro (Metais)",
    name: "Brass Instruments",
    icon: AudioLines,
  },
  {
    id: 8,
    sourceName: "Cordas Orquestrais",
    name: "Orchestral Strings",
    icon: Music,
  },
  { id: 9, sourceName: "Ukuleles", name: "Ukuleles", icon: Guitar },
];

export const Categories = () => {
  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="mb-14"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a8752e]">
            Find your sound
          </p>
          <h2
            id="categories-title"
            className="text-2xl font-extrabold tracking-tight text-[#181815] sm:text-3xl"
          >
            Explore Categories
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#756f64]">
          Browse our instrument families and discover the sound that inspires
          you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ id, name, icon: Icon }) => (
          <article
            key={id}
            className="group flex min-h-28 items-center gap-4 rounded-2xl border border-[#181815]/10 bg-[#fffdf8] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c99545]/50 hover:shadow-lg hover:shadow-[#181815]/5"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#c99545]/20 bg-[#e9e2d6] text-[#a8752e] transition-colors duration-200 group-hover:bg-[#c99545] group-hover:text-[#fffdf8]">
              <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <h3 className="text-base font-bold leading-snug text-[#181815]">
              {name}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
};
