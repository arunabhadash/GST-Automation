import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", weight: ["600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D2C-Sync",
  description: "GST automation, analytics, and integrations for D2C brands.",
  keywords: ["GST", "RTO", "D2C", "Shopify", "Shiprocket", "WooCommerce"],
  metadataBase: new URL("http://localhost:3000"),
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
