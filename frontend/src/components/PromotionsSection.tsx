import { useEffect, useState } from "react";
import { AlertCircle, Percent, Sparkles, Tag } from "lucide-react";
import { getPromotions } from "../services/api";
import type { Promotion } from "../types";

export const PromotionsSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPromotions()
      .then((data) => {
        setPromotions(
          data.filter((promotion) => promotion.is_active === 1 || promotion.is_active === true),
        );
      })
      .catch((err: unknown) => {
        console.error("Failed to load promotions:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || (promotions.length === 0 && !error)) {
    return null;
  }

  if (error) {
    return (
      <section
        id="promotions"
        className="mb-12 rounded-2xl border border-rose-500/20 bg-rose-950/20 p-5"
        aria-labelledby="promotions-title"
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <h2 id="promotions-title" className="font-semibold text-rose-200">
              Promotions are temporarily unavailable
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Please try again later while we reconnect to the store.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="promotions"
      className="mb-12 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 shadow-xl shadow-black/10 sm:p-8"
      aria-labelledby="promotions-title"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-amber-500 p-2.5 text-slate-950 shadow-lg shadow-amber-500/20">
          <Percent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            Offers for a limited time
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </p>
          <h2
            id="promotions-title"
            className="text-xl font-extrabold tracking-tight text-white sm:text-2xl"
          >
            Special deals &amp; promotions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <article
            key={promotion.promotion_id}
            className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-slate-950/70 p-4 transition-colors hover:border-amber-500/40"
          >
            <div className="min-w-0">
              <span className="mb-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Tag className="h-3 w-3" aria-hidden="true" />
                Offer #{promotion.promotion_id}
              </span>
              <p className="text-sm font-semibold leading-snug text-white">
                {promotion.description}
              </p>
              <a
                href="#catalog"
                className="mt-2 inline-flex text-xs font-medium text-slate-400 underline decoration-slate-600 underline-offset-2 transition-colors hover:text-amber-300"
                aria-label={`Browse the catalog for offer ${promotion.promotion_id}`}
              >
                Browse catalog
              </a>
            </div>
            <span className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 py-1.5 text-sm font-extrabold tabular-nums text-amber-300">
              -{promotion.discount_percent}%
            </span>
          </article>
        ))}
      </div>
    </section>
  );
};
