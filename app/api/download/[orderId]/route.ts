import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_: Request, { params }: { params: Promise<{ orderId: string }> }) {
  if (!supabaseAdmin.isConfigured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const { orderId } = await params;
  const order = await supabaseAdmin.getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (new Date(order.download_expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Download link expired" }, { status: 410 });
  }

  if (order.download_count >= order.max_downloads) {
    return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
  }

  const product = await supabaseAdmin.getProductById(order.product_id);
  if (!product) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const signedUrl = await supabaseAdmin.createSignedDownload(product.pdf_storage_path);
  if (!signedUrl) {
    return NextResponse.json({ error: "Could not create signed URL" }, { status: 500 });
  }

  await supabaseAdmin.incrementDownload(order.id, order.download_count);
  return NextResponse.redirect(signedUrl);
}
