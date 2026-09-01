import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Heart, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { CreateFlow } from "@/components/create-flow";
import { LisBrand } from "@/components/lis-brand";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* HERO SECTION matching Mockup cover */}
        <section className="hero-shell section-shell">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
            {/* Left Column: Romantic Typography & Value Proposition */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(253,242,244,0.85)] border border-[rgba(212,130,142,0.25)] text-xs font-semibold tracking-widest text-[var(--rose-dark)] uppercase">
                <Sparkle size={14} className="text-[var(--rose)]" weight="fill" />
                <span>20/10 · Trao gửi yêu thương</span>
              </div>

              <div>
                <span className="hero-romantic-title">Dearly,</span>
                <h1 className="hero-main-title">
                  from <span className="font-medium tracking-[0.25em] text-[var(--rose-dark)]">LIS</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-[var(--muted)] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Gửi một lời nhắn yêu thương đến người đặc biệt, ẩn giấu trọn vẹn bên trong món quà của bạn.
                </p>
              </div>

              {/* Journey CTAs: 01 Tạo lời chúc & 02 Mở lời nhắn */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 pt-2">
                <Link href="#tao-loi-chuc" className="journey-card journey-sender group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest text-[var(--rose)]">01</span>
                    <ArrowUpRight size={18} className="text-[var(--rose)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-xs text-[var(--muted)]">Bạn muốn gửi</span>
                  <strong className="font-display text-lg text-[var(--ink)] mt-0.5">Tạo lời nhắn</strong>
                  <span className="text-xs text-[var(--muted)] mt-1">Cho món quà bạn sắp trao</span>
                </Link>

                <Link href="/mo-qua" className="journey-card journey-recipient group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest text-[var(--teal-dark)]">02</span>
                    <ArrowUpRight size={18} className="text-[var(--teal-dark)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-xs text-[var(--muted)]">Bạn đang nhận</span>
                  <strong className="font-display text-lg text-[var(--ink)] mt-0.5">Mở lời nhắn</strong>
                  <span className="text-xs text-[var(--muted)] mt-1">Nhập 6 số để mở thư</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual Illustration (Pink Calla Lilies in Sage Box) */}
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[rgba(212,130,142,0.2)] bg-white">
                <Image
                  src="/images/calla-lily-hero.jpg"
                  alt="Hộp quà hoa Rum hồng LIS thanh lịch"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 440px"
                  className="object-cover"
                />
              </div>

              {/* Floating decorative label */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[rgba(212,130,142,0.25)] shadow-xl flex items-center gap-3">
                <div className="size-10 rounded-full bg-[rgba(253,242,244,0.9)] flex items-center justify-center text-[var(--rose)]">
                  <Heart size={20} weight="fill" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--ink)]">LIS Gifting Ritual</p>
                  <p className="text-[11px] text-[var(--muted)]">Tinh tế trong từng món quà</p>
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
