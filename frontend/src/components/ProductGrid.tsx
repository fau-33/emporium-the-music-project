import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ImageOff,
  Loader2,
  Percent,
  X,
} from "lucide-react";
import { getProducts, getPromotions } from "../services/api";
import type { Product, Promotion } from "../types";
import { ProductCard, productImageById } from "./ProductCard";

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

interface ProductDetailsModalProps {
  product: Product;
  promotion?: Promotion;
  onClose: () => void;
}

const ProductDetailsModal = ({
  product,
  promotion,
  onClose,
}: ProductDetailsModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageSources = [
    productImageById[product.product_id],
    product.image_url?.trim(),
  ].filter((url): url is string => Boolean(url));
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = imageSources[imageIndex] ?? null;
  const discountedPrice = promotion
    ? Math.round(
        product.price_brl * (1 - promotion.discount_percent / 100) * 100,
      ) / 100
    : null;
  const availability =
    product.status === "coming_soon"
      ? "Coming Soon"
      : product.status === "discontinued"
        ? "Discontinued"
        : product.stock_quantity > 0
          ? `In Stock (${product.stock_quantity})`
          : "Out of Stock";

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center bg-slate-950 p-6 sm:min-h-80">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                onError={() => setImageIndex((index) => index + 1)}
                className="max-h-80 w-full object-contain"
              />
            ) : (
              <div
                className="flex flex-col items-center gap-2 text-slate-500"
                role="img"
                aria-label={`No image available for ${product.name}`}
              >
                <ImageOff
                  className="h-10 w-10 text-amber-500/60"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Image unavailable
                </span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Product #{product.product_id}
            </p>
            <h2
              id="product-details-title"
              className="mt-2 pr-10 text-2xl font-extrabold text-white sm:text-3xl"
            >
              {product.name}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {product.description}
            </p>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <span className="block text-xs uppercase tracking-wider text-slate-500">
                Price
              </span>
              {promotion && discountedPrice !== null ? (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-base text-slate-500 line-through">
                    {formatPrice(product.price_brl)}
                  </span>
                  <span className="text-2xl font-extrabold text-amber-300">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-300">
                    <Percent className="h-3 w-3" aria-hidden="true" />
                    {promotion.discount_percent}% off
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {formatPrice(product.price_brl)}
                </p>
              )}
            </div>

            <div className="mt-5 border-t border-slate-800 pt-5">
              <span className="block text-xs uppercase tracking-wider text-slate-500">
                Availability
              </span>
              <p
                className={`mt-1 inline-flex items-center gap-2 text-sm font-semibold ${
                  product.status === "active" && product.stock_quantity > 0
                    ? "text-emerald-400"
                    : "text-slate-300"
                }`}
              >
                {product.status === "coming_soon" ? (
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                ) : product.status === "active" &&
                  product.stock_quantity > 0 ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {availability}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const uniqueProducts = new Map(
          data.map((product) => [product.product_id, product]),
        );
        setProducts(Array.from(uniqueProducts.values()));
      })
      .catch((err: unknown) => {
        console.error("Failed to load products from backend:", err);
        setError("Could not connect to the backend catalog.");
      })
      .finally(() => setLoading(false));

    getPromotions()
      .then((data) => {
        setPromotions(
          data.filter(
            (promotion) =>
              (promotion.is_active === 1 || promotion.is_active === true) &&
              Number.isFinite(promotion.discount_percent) &&
              promotion.discount_percent > 0 &&
              promotion.discount_percent <= 100,
          ),
        );
      })
      .catch((err: unknown) => {
        console.error("Failed to load promotions:", err);
      });
  }, []);

  const promotionsByProductId = new Map(
    promotions.map((promotion) => [promotion.product_id, promotion]),
  );
  const closeProductDetails = useCallback(() => setSelectedProduct(null), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-3 text-sm font-medium text-slate-400">
          Loading instruments catalog...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/20 px-4 py-16 text-center"
        role="alert"
      >
        <AlertCircle className="mb-2 h-10 w-10 text-rose-400" />
        <p className="text-sm font-semibold text-rose-200">{error}</p>
        <p className="mt-1 text-xs text-slate-400">
          Please ensure your FastAPI backend is running on{" "}
          http://127.0.0.1:8000.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-slate-400">
        No products are currently available.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            promotion={promotionsByProductId.get(product.product_id)}
            onSelect={setSelectedProduct}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          key={selectedProduct.product_id}
          product={selectedProduct}
          promotion={promotionsByProductId.get(selectedProduct.product_id)}
          onClose={closeProductDetails}
        />
      )}
    </>
  );
};
