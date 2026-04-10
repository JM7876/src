import { CollectionCard } from "@/components/CollectionCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCollections } from "@/lib/products";

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <main className="container">
      <SiteHeader />
      <section className="hero">
        <h1>Production-ready AI workflow tools for modern service teams.</h1>
        <p>
          Wolf Flow LLC delivers downloadable PDF playbooks, templates, and configuration kits for U.S.
          small businesses and professional services firms.
        </p>
        <a className="btn" href="/catalog">Explore the Catalog</a>
      </section>

      <section>
        <h2>Collections</h2>
        <div className="grid" style={{ marginTop: "1rem" }}>
          {collections.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Why Wolf Flow</h2>
        <ul>
          <li>U.S. LLC with professional-grade digital tools</li>
          <li>Secure Stripe Checkout with instant fulfillment</li>
          <li>Time-limited download links with controlled access</li>
        </ul>
      </section>
      <SiteFooter />
    </main>
  );
}
