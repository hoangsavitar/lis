import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIS BY LII — Trao điều chưa kịp nói",
  description: "Gửi một lời chúc riêng cùng món quà từ LIS BY LII.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
