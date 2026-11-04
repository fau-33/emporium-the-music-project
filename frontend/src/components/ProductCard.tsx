import { AlertCircle, CheckCircle2, Tag } from "lucide-react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

const acousticGuitarImage =
  "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80";

const getProductImage = (product: Product): string => {
  if (product.image_url) {
    return product.image_url;
  }

  const searchText = `${product.name} ${product.description}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/\b(ukulele|ukelele)\b/.test(searchText)) {
    return "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80";
  }
  if (/\b(baixo|bass)\b/.test(searchText)) {
    return "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80";
  }
  if (/\b(bateria|drum|pearl|tama)\b/.test(searchText)) {
    return "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80";
  }
  if (/\b(teclado|sintetizador|korg|nord|roland|piano)\b/.test(searchText)) {
    return "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80";
  }

  if (
    /\b(violao|guitarra|acoustic|folk|dreadnought|nylon|7 cordas)\b/.test(
      searchText,
    )
  ) {
    return acousticGuitarImage;
  }

  return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const inStock = product.status === "active" && product.stock_quantity > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 hover:border-amber-500/50">
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={getProductImage(product)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
            <span className="text-lg font-extrabold text-white">
              {formatPrice(product.price_brl)}
            </span>
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
