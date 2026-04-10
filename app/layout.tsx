import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} | AI Workflow Toolkits`,
  description: "Professional downloadable AI workflow tools for U.S. small businesses and service firms.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: `${SITE_NAME} Storefront`,
    description: "Digital AI workflow toolkits with instant delivery.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
