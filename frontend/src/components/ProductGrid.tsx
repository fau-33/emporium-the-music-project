import { useEffect, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { getProducts, getPromotions } from "../services/api";
import type { Product, Promotion } from "../types";
import { ProductCard } from "./ProductCard";

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
          Please ensure your FastAPI backend is running on
          {" "}http://127.0.0.1:8000.
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
        <section
          className="mt-8 rounded-2xl border border-amber-500/30 bg-slate-900 p-5 sm:p-6"
          aria-labelledby="product-details-title"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
                Product #{selectedProduct.product_id} · Category #
                {selectedProduct.category_id}
              </p>
              <h3
                id="product-details-title"
                className="mt-1 text-xl font-bold text-white"
              >
                {selectedProduct.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              aria-label="Close product details"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            {selectedProduct.description}
          </p>

          <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-800 pt-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">Price</dt>
              <dd className="mt-1 font-semibold text-white">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedProduct.price_brl)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Availability</dt>
              <dd className="mt-1 font-semibold text-white">
                {selectedProduct.status === "coming_soon"
                  ? "Coming Soon"
                  : selectedProduct.status === "discontinued"
                    ? "Discontinued"
                    : selectedProduct.stock_quantity > 0
                      ? `In Stock (${selectedProduct.stock_quantity})`
                      : "Out of Stock"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="mt-1 font-semibold capitalize text-white">
                {selectedProduct.status.replace("_", " ")}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </>
  );
};
