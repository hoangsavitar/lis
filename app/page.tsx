import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Heart, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { CreateFlow } from "@/components/create-flow";
import { FloralArt } from "@/components/floral-art";
import { LisBrand } from "@/components/lis-brand";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* HERO SECTION matching Mockup cover */}
        <section className="hero-shell section-shell relative overflow-hidden">
          {/* Animated Botanical Floating Flowers in background */}
          <FloralArt className="bg-floral-art bg-floral-left" decorative />
          <FloralArt className="bg-floral-art bg-floral-right" decorative />

          <div className="grid gap-8 lg:gap-12 items-center relative z-10 lg:grid-cols-[1.1fr_0.9fr] min-w-0">
            {/* Left Column: Cover like mockup */}
            <div className="space-y-6 text-center lg:text-left min-w-0 max-w-full">
              <div className="inline-flex max-w-full min-w-0 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(253,241,243,0.9)] border border-[var(--line)] text-[11px] font-semibold tracking-wider text-[var(--rose-dark)] uppercase overflow-hidden">
                <Sparkle size={14} className="text-[var(--rose)] shrink-0" weight="fill" />
                <span className="text-center leading-relaxed">20/10 · Gửi lời nhắn yêu thương</span>
              </div>

              <div>
                <span className="hero-romantic-title">Dearly,</span>
                <h1 className="hero-main-title">
                  from <span className="not-italic font-semibold tracking-[0.18em] text-[var(--rose-dark)]">LIS</span>
                </h1>
                <p className="mt-4 text-[15px] sm:text-base text-[var(--muted)] max-w-md mx-auto lg:mx-0 leading-relaxed text-balance">
                  Gửi một lời nhắn yêu thương đến người đặc biệt.
                </p>
              </div>

              {/* Single primary CTA like mockup cover */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="#tao-loi-chuc" className="btn-primary w-full sm:w-auto min-w-44">
                  <span>Bắt đầu viết lời nhắn</span>
                </Link>
                <Link href="/mo-qua" className="btn-ghost w-full sm:w-auto min-w-44">
                  <span>Mở lời nhắn</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <p className="text-xs text-[var(--muted)]">Người nhận có thiệp? Chỉ cần nhập 6 số trên thiệp.</p>
            </div>

            {/* Right Column: Hero Visual — gift box like mockup */}
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-sm">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--line)] bg-white shadow-[var(--shadow-card)]">
                <Image
                  src="/images/calla-lily-hero.jpg"
                  alt="Hộp quà túi xách LIS màu sage kèm hoa Rum hồng"
                  fill
                  priority
                  sizes="(max-width: 640px) 320px, 400px"
                  className="object-cover"
                />
              </div>

              {/* Floating label — compact mobile */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-left-4 sm:bottom-6 whitespace-nowrap bg-white/95 px-4 py-2.5 rounded-2xl border border-[var(--line)] flex items-center gap-2.5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="size-9 rounded-full bg-[var(--rose-soft)] flex items-center justify-center text-[var(--rose-dark)] shrink-0">
                  <Heart size={18} weight="fill" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[var(--ink)]">LIS · Lời trao gửi</p>
                  <p className="text-[11px] text-[var(--muted)]">Gói trọn yêu thương</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="#tao-loi-chuc"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--rose-dark)] hover:opacity-80 transition-opacity"
            >
              <span>Bắt đầu viết lời nhắn</span>
              <ArrowDown size={14} className="animate-bounce" />
            </a>
          </div>
        </section>

        {/* Form creation section */}
        <CreateFlow />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <LisBrand compact />
          <p className="text-xs text-[var(--muted)] flex items-center justify-center sm:justify-start gap-1.5">
            <span>Gói trọn lời yêu thương trong từng món quà</span>
            <Heart size={14} weight="fill" className="text-[var(--rose)]" aria-hidden="true" />
          </p>
        </div>
      </footer>
    </>
  );
}
