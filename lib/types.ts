export type ServiceCode = "S2" | "S3" | "S4" | "S5" | "S7";

export interface Product {
  id: string;
  slug: string;
  service: ServiceCode;
  item_number: number;
  name: string;
  description: string;
  price_cents: number;
  collection_name: string;
  collection_slug: string;
  pdf_filename: string;
  pdf_storage_path: string;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  active: boolean;
}

export interface Collection {
  name: string;
  slug: string;
  description: string;
  service: ServiceCode;
  sort_order: number;
}

export interface Order {
  id: string;
  product_id: string;
  stripe_session_id: string;
  customer_email: string;
  amount_cents: number;
  download_url: string | null;
  download_expires_at: string | null;
  download_count: number;
  max_downloads: number;
  status: string;
  product?: Product;
}
