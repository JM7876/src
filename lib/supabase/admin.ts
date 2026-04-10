const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers() {
  return {
    apikey: serviceRoleKey ?? "",
    Authorization: `Bearer ${serviceRoleKey ?? ""}`,
    "Content-Type": "application/json",
  };
}

async function tableSelect(table: string, query: string) {
  if (!baseUrl || !serviceRoleKey) {
    return null;
  }
  const response = await fetch(`${baseUrl}/rest/v1/${table}?${query}`, { headers: headers(), cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export const supabaseAdmin = {
  isConfigured: Boolean(baseUrl && serviceRoleKey),
  async getOrderBySession(sessionId: string) {
    const rows = (await tableSelect("orders", `stripe_session_id=eq.${sessionId}&select=id,download_count,max_downloads&limit=1`)) as Array<{ id: string; download_count: number; max_downloads: number; }> | null;
    return rows?.[0] ?? null;
  },
  async getOrderById(orderId: string) {
    const rows = (await tableSelect("orders", `id=eq.${orderId}&select=id,product_id,download_expires_at,download_count,max_downloads&limit=1`)) as Array<{ id: string; product_id: string; download_expires_at: string; download_count: number; max_downloads: number; }> | null;
    return rows?.[0] ?? null;
  },
  async getProductById(productId: string) {
    const rows = (await tableSelect("products", `id=eq.${productId}&select=id,pdf_storage_path&limit=1`)) as Array<{ id: string; pdf_storage_path: string; }> | null;
    return rows?.[0] ?? null;
  },
  async incrementDownload(orderId: string, count: number) {
    if (!baseUrl || !serviceRoleKey) return;
    await fetch(`${baseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ download_count: count + 1 }),
    });
  },
  async createSignedDownload(path: string) {
    if (!baseUrl || !serviceRoleKey) return null;
    const response = await fetch(`${baseUrl}/storage/v1/object/sign/product-files/${path}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ expiresIn: 86400 }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { signedURL?: string };
    return payload.signedURL ? `${baseUrl}/storage/v1${payload.signedURL}` : null;
  },
};
