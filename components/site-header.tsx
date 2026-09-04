import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { LisBrand } from "@/components/lis-brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="section-shell flex min-h-16 items-center justify-between gap-2 py-2">
        <Link href="/" className="min-w-0 shrink-0" aria-label="LIS BY LII — Trang chủ">
          <LisBrand compact />
        </Link>
        <nav className="flex min-w-0 items-center gap-1 sm:gap-2" aria-label="Điều hướng chính">
          <Link href="/open" className="header-link">Mở lời nhắn</Link>
          <Link href="/#tao-loi-chuc" className="header-cta">
            <span className="hidden sm:inline">Gửi lời chúc</span>
            <span className="sm:hidden">Gửi</span>
            <ArrowUpRight size={15} aria-hidden="true" className="shrink-0" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
