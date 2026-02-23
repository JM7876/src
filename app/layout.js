/*
 * WOLF FLOW — Root Layout
 * Created and Authored by Johnathon Moulds © 2026
 */

import "./globals.css";

export const metadata = {
  title: "WOLF FLOW — NHBP Communications",
  description: "Nottawaseppi Huron Band of the Potawatomi — Communications Department Workflow System",
  authors: [{ name: "Johnathon Moulds" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
