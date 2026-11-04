import { AlertCircle, CheckCircle2, ImageOff, Tag } from "lucide-react";
import { useState } from "react";
import type { Product, Promotion } from "../types";

interface ProductCardProps {
  product: Product;
  promotion?: Promotion;
  onSelect?: (product: Product) => void;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

export const ProductCard = ({
  product,
  promotion,
  onSelect,
}: ProductCardProps) => {
  const inStock = product.status === "active" && product.stock_quantity > 0;
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const imageUrl = product.image_url?.trim() || null;
  const showImage = imageUrl !== null && failedImageUrl !== imageUrl;
  const discountedPrice = promotion
    ? Math.round(
        product.price_brl * (1 - promotion.discount_percent / 100) * 100,
      ) / 100
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 hover:border-amber-500/50">
      <div className="relative h-48 overflow-hidden bg-slate-950">
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setFailedImageUrl(imageUrl)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500"
            role="img"
            aria-label={`No image available for ${product.name}`}
          >
            <ImageOff className="h-8 w-8 text-amber-500/60" aria-hidden="true" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
              Image unavailable
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3">
          {product.status === "coming_soon" ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 backdrop-blur-md">
              Coming Soon
            </span>
          ) : product.status === "discontinued" ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
              Discontinued
            </span>
          ) : inStock ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              In Stock ({product.stock_quantity})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 backdrop-blur-md">
              <AlertCircle className="h-3.5 w-3.5" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-amber-400">
            <Tag className="h-3.5 w-3.5" />
            <span>Product #{product.product_id}</span>
          </div>
          <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-amber-400">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">
              Price
            </span>
            {promotion && discountedPrice !== null ? (
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(product.price_brl)}
                </span>
                <span className="text-lg font-extrabold text-amber-300">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  -{promotion.discount_percent}%
                </span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-white">
                {formatPrice(product.price_brl)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelect?.(product)}
            className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-400 transition-all duration-200 hover:bg-amber-500 hover:text-slate-950"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};
