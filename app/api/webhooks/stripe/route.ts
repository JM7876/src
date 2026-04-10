import { sendPurchaseEmail } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyStripeSignature } from "@/lib/stripe";

type StripeEvent = {
  type: "checkout.session.completed" | "checkout.session.expired";
  data: {
    object: {
      id: string;
      metadata?: { product_id?: string };
      customer_details?: { email?: string };
      payment_intent?: string;
      amount_total?: number;
      currency?: string;
    };
  };
};

async function upsertOrder(session: StripeEvent["data"]["object"], status: "completed" | "expired") {
  if (!supabaseAdmin.isConfigured) {
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!baseUrl || !serviceRoleKey) {
    return;
  }

  const productId = session.metadata?.product_id;
  const email = session.customer_details?.email;
  if (!productId || !email) {
    return;
  }

  const product = await supabaseAdmin.getProductById(productId);
  if (!product) {
    return;
  }

  const downloadUrl = status === "completed" ? await supabaseAdmin.createSignedDownload(product.pdf_storage_path) : null;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await fetch(`${baseUrl}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      product_id: productId,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent ?? null,
      customer_email: email,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      download_url: downloadUrl,
      download_expires_at: expiresAt,
      status,
    }),
  });

  if (status === "completed" && downloadUrl) {
    await sendPurchaseEmail(email, downloadUrl);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing webhook signature", { status: 400 });
  }

  const payload = await request.text();
  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    await upsertOrder(event.data.object, "completed");
  }

  if (event.type === "checkout.session.expired") {
    await upsertOrder(event.data.object, "expired");
  }

  return new Response("ok", { status: 200 });
}
