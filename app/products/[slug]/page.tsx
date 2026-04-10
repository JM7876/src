import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllProducts, getCollections, getProductBySlug } from "@/lib/products";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const collections = await getCollections();
  const collection = collections.find((item) => item.slug === product.collection_slug);
  const related = (await getAllProducts())
    .filter((item) => item.collection_slug === product.collection_slug && item.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="container">
      <SiteHeader />
      <p>
        <Link href="/">Home</Link> &gt; <Link href={`/collections/${product.collection_slug}`}>{collection?.name ?? "Collection"}</Link> &gt; {product.name}
      </p>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>${(product.price_cents / 100).toFixed(2)}</h2>
      <form action="/api/checkout" method="POST" style={{ marginTop: "1rem" }}>
        <input type="hidden" name="productId" value={product.id} />
        <button className="btn" type="submit">Buy Now</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Related products</h3>
      <div className="grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
