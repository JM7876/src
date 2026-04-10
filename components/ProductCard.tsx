import Link from "next/link";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <p style={{ fontSize: ".85rem", color: "#456" }}>{product.collection_name}</p>
      <h3 style={{ marginTop: ".4rem" }}>{product.name}</h3>
      <p>${(product.price_cents / 100).toFixed(2)}</p>
      <Link className="btn" href={`/products/${product.slug}`}>View</Link>
    </article>
  );
}
