/*
 * WOLF FLOW — Root Layout
 * Created and Authored by Johnathon Moulds © 2026
 */

import "./globals.css";

export const metadata = {
  title: "NHBP Communications Portal",
  description: "Nottawaseppi Huron Band of the Potawatomi — Communications Department Workflow System",
  authors: [{ name: "Johnathon Moulds" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="night">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
