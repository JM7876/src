import fs from "node:fs/promises";
import path from "node:path";

type SeedProduct = {
  name: string;
  service: string;
  item_number: number;
  description: string;
  price_cents: number;
  collection_name: string;
  collection_slug: string;
  pdf_filename: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

async function stripeRequest<T>(pathName: string, body: URLSearchParams): Promise<T> {
  const key = requireEnv("STRIPE_SECRET_KEY");
  const response = await fetch(`https://api.stripe.com/v1/${pathName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Stripe request failed: ${pathName}`);
  }

  return response.json() as Promise<T>;
}

async function run() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const productsFile = path.join(process.cwd(), "data", "products.json");
  const raw = await fs.readFile(productsFile, "utf8");
  const products = JSON.parse(raw) as SeedProduct[];

  const headers = {
    apikey: serviceRole,
    Authorization: `Bearer ${serviceRole}`,
    "Content-Type": "application/json",
  };

  const collections = new Map<string, { name: string; slug: string; description: string; service: string }>();
  for (const product of products) {
    collections.set(product.service, {
      name: product.collection_name,
      slug: product.collection_slug,
      description: `${product.collection_name} collection`,
      service: product.service,
    });
  }

  for (const [idx, collection] of [...collections.values()].entries()) {
    await fetch(`${supabaseUrl}/rest/v1/collections`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ ...collection, sort_order: idx + 1 }),
    });
  }

  const report = { productsProcessed: 0, filesUploaded: 0, stripePricesAssigned: 0 };

  for (const product of products) {
    const slug = `${product.collection_slug}-${product.item_number}`;
    const pdfStoragePath = `${product.service}/${product.pdf_filename}`;

    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/products?slug=eq.${slug}&select=id,stripe_product_id,stripe_price_id&limit=1`, { headers });
    const existingRows = (await existingResponse.json()) as Array<{ stripe_product_id?: string; stripe_price_id?: string }>;
    const existing = existingRows[0];

    let stripeProductId = existing?.stripe_product_id;
    let stripePriceId = existing?.stripe_price_id;

    if (!stripeProductId) {
      const form = new URLSearchParams({ name: product.name, description: product.description });
      const stripeProduct = await stripeRequest<{ id: string }>("products", form);
      stripeProductId = stripeProduct.id;
    }

    if (!stripePriceId && stripeProductId) {
      const form = new URLSearchParams({
        product: stripeProductId,
        unit_amount: String(product.price_cents),
        currency: "usd",
      });
      const stripePrice = await stripeRequest<{ id: string }>("prices", form);
      stripePriceId = stripePrice.id;
      report.stripePricesAssigned += 1;
    }

    const localPdfPath = path.join(process.cwd(), "data", "pdfs", product.pdf_filename);
    const fileData = await fs.readFile(localPdfPath);

    const upload = await fetch(`${supabaseUrl}/storage/v1/object/product-files/${pdfStoragePath}`, {
      method: "POST",
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        "Content-Type": "application/pdf",
        "x-upsert": "true",
      },
      body: fileData,
    });

    if (upload.ok) {
      report.filesUploaded += 1;
    }

    await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        slug,
        service: product.service,
        item_number: product.item_number,
        name: product.name,
        description: product.description,
        price_cents: product.price_cents,
        collection_name: product.collection_name,
        collection_slug: product.collection_slug,
        pdf_filename: product.pdf_filename,
        pdf_storage_path: pdfStoragePath,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
        active: true,
      }),
    });

    report.productsProcessed += 1;
  }

  console.log("Seed verification report:");
  console.table(report);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
