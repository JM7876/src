import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCollectionBySlug, getCollections } from "@/lib/products";

export const revalidate = 300;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getCollectionBySlug(slug);
  if (!payload) {
    notFound();
  }

  return (
    <main className="container">
      <SiteHeader />
      <h1>{payload.collection.name}</h1>
      <p>{payload.collection.description}</p>
      <div className="grid" style={{ marginTop: "1rem" }}>
        {payload.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
