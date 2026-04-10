import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

async function getOrder(sessionId: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = await fetch(`${base}/api/orders/by-session?session_id=${sessionId}`, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;

  if (!params.session_id) {
    return (
      <main className="container">
        <SiteHeader />
        <h1>Missing session</h1>
        <p>We could not verify your checkout session.</p>
        <SiteFooter />
      </main>
    );
  }

  const order = await getOrder(params.session_id);

  return (
    <main className="container">
      <SiteHeader />
      <h1>Purchase complete</h1>
      <p>Your order has been confirmed.</p>
      {order ? (
        <>
          <p>Order ID: {order.id}</p>
          <p>Downloads used: {order.download_count} / {order.max_downloads}</p>
          <Link className="btn" href={`/api/download/${order.id}`}>Download your file</Link>
        </>
      ) : (
        <p>Order details are still processing. Check your email shortly.</p>
      )}
      <SiteFooter />
    </main>
  );
}
