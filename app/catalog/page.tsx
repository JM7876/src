import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllProducts, getCollections } from "@/lib/products";

export const revalidate = 300;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; collection?: string }>;
}) {
  const params = await searchParams;
  const products = await getAllProducts();
  const collections = await getCollections();
  const q = params.q?.toLowerCase() ?? "";
  const collection = params.collection ?? "";

  const filtered = products.filter((product) => {
    const queryMatch = !q || product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    const collectionMatch = !collection || product.collection_slug === collection;
    return queryMatch && collectionMatch;
  });

  return (
    <main className="container">
      <SiteHeader />
      <h1>Catalog</h1>
      <form style={{ display: "grid", gap: ".7rem", margin: "1rem 0" }}>
        <input name="q" placeholder="Search products" defaultValue={params.q ?? ""} style={{ padding: ".7rem" }} />
        <select name="collection" defaultValue={collection} style={{ padding: ".7rem" }}>
          <option value="">All collections</option>
          {collections.map((item) => (
            <option key={item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <button className="btn" type="submit">Apply Filters</button>
      </form>
      <p>{filtered.length} products shown.</p>
      <div className="grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
