import crypto from "node:crypto";

type StripeSessionResponse = { id: string; url: string | null };

export async function createCheckoutSession(input: {
  name: string;
  description: string;
  amount: number;
  productId: string;
  stripePriceId?: string | null;
  successUrl: string;
  cancelUrl: string;
}) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", input.successUrl);
  form.set("cancel_url", input.cancelUrl);
  form.set("metadata[product_id]", input.productId);
  form.set("automatic_tax[enabled]", "true");

  if (input.stripePriceId) {
    form.set("line_items[0][price]", input.stripePriceId);
    form.set("line_items[0][quantity]", "1");
  } else {
    form.set("line_items[0][price_data][currency]", "usd");
    form.set("line_items[0][price_data][unit_amount]", String(input.amount));
    form.set("line_items[0][price_data][product_data][name]", input.name);
    form.set("line_items[0][price_data][product_data][description]", input.description);
    form.set("line_items[0][quantity]", "1");
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as StripeSessionResponse;
}

export function verifyStripeSignature(payload: string, signatureHeader: string, webhookSecret: string) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((entry) => entry.startsWith("t="))?.slice(2);
  const v1 = parts.find((entry) => entry.startsWith("v1="))?.slice(3);
  if (!timestamp || !v1) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const computed = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1));
}
