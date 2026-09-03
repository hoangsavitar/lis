import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIS — Dearly, from LIS | Lời nhắn cùng món quà",
  description: "Gửi một lời nhắn yêu thương đến người đặc biệt cùng món quà từ LIS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}

