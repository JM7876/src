import { COLLECTIONS } from "@/lib/constants";
import { Collection, Product } from "@/lib/types";

const fallbackProducts: Product[] = COLLECTIONS.flatMap((collection, index) =>
  Array.from({ length: collection.service === "S7" ? 10 : 20 }).map((_, i) => ({
    id: `${collection.service}-${i + 1}`,
    slug: `${collection.slug}-${i + 1}`,
    service: collection.service,
    item_number: i + 1,
    name: `${collection.name} ${i + 1}`,
    description: `Preview product ${i + 1} for ${collection.name}. Replace this using products.json and the seed script.`,
    price_cents:
      collection.service === "S2" || collection.service === "S7"
        ? 9700
        : collection.service === "S3"
          ? 29700
          : collection.service === "S4"
            ? 19700
            : 39700,
    collection_name: collection.name,
    collection_slug: collection.slug,
    pdf_filename: `placeholder-${index}-${i + 1}.pdf`,
    pdf_storage_path: `${collection.service}/placeholder-${index}-${i + 1}.pdf`,
    active: true,
  })),
);

async function fetchFromSupabase(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    return null;
  }

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = (await fetchFromSupabase("products?active=eq.true&select=*&order=collection_name.asc,item_number.asc")) as Product[] | null;
  return rows ?? fallbackProducts;
}

export async function getCollections(): Promise<Collection[]> {
  const rows = (await fetchFromSupabase("collections?select=*&order=sort_order.asc")) as Collection[] | null;
  return rows ?? COLLECTIONS;
}

export async function getCollectionBySlug(slug: string) {
  const collections = await getCollections();
  const collection = collections.find((item) => item.slug === slug);

  if (!collection) {
    return null;
  }

  const products = await getAllProducts();
  return {
    collection,
    products: products.filter((item) => item.collection_slug === slug),
  };
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((item) => item.slug === slug) ?? null;
}
