import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { getProducts } from "../services/api";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
  }, []);

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};
