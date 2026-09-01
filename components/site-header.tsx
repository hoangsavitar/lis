import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { LisBrand } from "@/components/lis-brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="section-shell flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" className="brand-link" aria-label="LIS BY LII — Trang chủ">
          <LisBrand />
        </Link>
        <nav className="flex items-center gap-2" aria-label="Điều hướng chính">
          <Link href="/mo-qua" className="header-link">Mở lời nhắn</Link>
          <Link href="/#tao-loi-chuc" className="header-cta">
            Gửi lời chúc <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
