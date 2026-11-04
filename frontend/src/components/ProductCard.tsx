import { AlertCircle, CheckCircle2, ImageOff, Tag } from "lucide-react";
import { useState } from "react";
import type { Product, Promotion } from "../types";

interface ProductCardProps {
  product: Product;
  promotion?: Promotion;
  onSelect?: (product: Product) => void;
}

export const productImageById: Record<number, string> = {
  81: "/images/products/yamaha-c40-natural.jpg",
  82: "/images/products/yamaha-c70-natural.jpg",
  83: "/images/products/tagima-memphis-ac-39-natural.jpg",
  84: "/images/products/giannini-gn-15-natural.jpg",
  85: "/images/products/product-85-rozinirc104.jpg",
  86: "/images/products/tagima-dallas-tuner-natural.webp",
  87: "/images/products/yamaha-f310-natural.jpg",
  88: "/images/products/product-88-gianninigf1r.jpg",
  89: "/images/products/product-89-shelbysn100.jpg",
  90: "/images/products/product-90-crafter-ht-100.jpg",
  91: "/images/products/product-91-tagimawoodstock.jpg",
  92: "/images/products/product-92-yamaha-fg800.jpg",
  93: "/images/products/product-93-martin-d28.webp",
  94: "/images/products/taylor-110e-natural.jpg",
  95: "/images/products/takamine-gd20-natural-satin.png",
  96: "/images/products/product-96-gianninigf3d.jpg",
  97: "/images/products/product-97-crafter-d8.jpg",
  98: "/images/products/product-98-yamaha-ntx1.jpg",
  99: "/images/products/product-99-tagimaclassical.jpg",
  100: "/images/products/product-100-takamine-gc5ce.png",
  101: "/images/products/product-101-giannini-gnf-3-ceq.jpg",
  102: "/images/products/product-102-crafterce15.jpg",
  103: "/images/products/product-103-tagimavegas.jpg",
  104: "/images/products/product-104-yamaha-apx600.jpg",
  105: "/images/products/product-105-takamine-gn51ce.png",
  106: "/images/products/product-106-taylor-214ce.jpg",
  107: "/images/products/product-107-shelbysgd195e.jpg",
  108: "/images/products/product-108-martind28e.jpg",
  109: "/images/products/product-109-rozinirv174.jpg",
  110: "/images/products/product-110-gianninigwne7.jpg",
  111: "/images/products/product-111-rozinirv175.jpg",
  112: "/images/products/product-112-tagimatw7.jpg",
  113: "/images/products/product-113-shelbysn7c.jpg",
  114: "/images/products/product-114-yamaha-cg162s.jpg",
  115: "/images/products/product-115-takamine-gc1ce.jpg",
  116: "/images/products/product-116-kala-ka-15s.jpg",
  117: "/images/products/product-117-ohana-sk-10.jpg",
  118: "/images/products/product-118-kalani-kal-300s.jpg",
  119: "/images/products/product-119-shelbysu21s.jpg",
  120: "/images/products/product-120-kala-ka-c.webp",
  121: "/images/products/ohana-ck-20-natural.jpg",
  122: "/images/products/product-122-kalanikal500c.jpg",
  123: "/images/products/product-123-kala-ka-smhce.jpg",
  124: "/images/products/product-124-kala-ka-t.jpg",
  125: "/images/products/product-125-ohanatk35g.jpg",
  126: "/images/products/product-126-kalakasrtctg.jpg",
  127: "/images/products/product-127-kalanikal700t.jpg",
  128: "/images/products/product-128-kala-ka-b.jpg",
  129: "/images/products/product-129-ohanabk35e.jpg",
  130: "/images/products/product-130-kalakaabpctg.jpg",
  131: "/images/products/product-131-gibsonlespaul.jpg",
  132: "/images/products/product-132-ibanezrg550.jpg",
  133: "/images/products/product-133-prssecustom24.jpg",
  134: "/images/products/product-134-fender-player-telecaster.jpg",
  135: "/images/products/product-135-musicmanbass1x.jpg",
  136: "/images/products/product-136-ibanezbass2x.jpg",
  137: "/images/products/product-137-yamahabass3x.jpg",
  138: "/images/products/product-138-musicmanbass4x.jpg",
  139: "/images/products/product-139-yamahakit1.jpg",
  140: "/images/products/product-140-pearlkit2.jpg",
  141: "/images/products/product-141-yamahakit3.jpg",
  142: "/images/products/product-142-korgsynth1.jpg",
  143: "/images/products/product-143-nordsynth2.jpg",
  144: "/images/products/product-144-rolandsynth3.jpg",
  145: "/images/products/product-145-fender-american-pro-ii-stratocaster.png",
};

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
  const backendImageUrl = product.image_url?.trim() || null;
  const imageSources = [
    productImageById[product.product_id],
    backendImageUrl,
  ].filter((url): url is string => Boolean(url));
  const [imageAttempt, setImageAttempt] = useState<{
    productId: number;
    backendImageUrl: string | null;
    index: number;
  }>({
    productId: product.product_id,
    backendImageUrl,
    index: 0,
  });
  const isCurrentProduct =
    imageAttempt.productId === product.product_id &&
    imageAttempt.backendImageUrl === backendImageUrl;
  const imageIndex = isCurrentProduct ? imageAttempt.index : 0;
  const imageUrl = imageSources[imageIndex] ?? null;
  const showImage = imageUrl !== null;
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
            onError={() =>
              setImageAttempt({
                productId: product.product_id,
                backendImageUrl,
                index: imageIndex + 1,
              })
            }
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
