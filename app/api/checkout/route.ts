import { NextResponse } from "next/server";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = formData.get("productId")?.toString();
  const slug = formData.get("slug")?.toString();

  let product = null;
  if (slug) {
    product = await getProductBySlug(slug);
  } else if (productId) {
    const products = await getAllProducts();
    product = products.find((item) => item.id === productId) ?? null;
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await createCheckoutSession({
    name: product.name,
    description: product.description,
    amount: product.price_cents,
    productId: product.id,
    stripePriceId: product.stripe_price_id,
    successUrl: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/products/${product.slug}`,
  });

  if (!session?.url) {
    return NextResponse.json({ error: "Unable to create Stripe session" }, { status: 500 });
  }

    return NextResponse.redirect(session.url, 303);
}
