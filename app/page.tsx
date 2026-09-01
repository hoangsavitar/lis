import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, HeartStraight } from "@phosphor-icons/react/dist/ssr";
import { CreateFlow } from "@/components/create-flow";
import { FloralArt } from "@/components/floral-art";
import { LisBrand } from "@/components/lis-brand";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-shell section-shell">
          <FloralArt className="hero-floral-art hero-floral-left" decorative />
          <FloralArt className="hero-floral-art hero-floral-right" decorative />
          <div className="hero-intro">
            <p className="eyebrow">Một món quà · Một điều thật lòng</p>
            <h1 className="hero-title">
              Trao điều<br />
              <em>chưa kịp nói.</em>
            </h1>
            <p className="hero-lead">LIS BY LII giữ lời bạn trong một tấm thư dành riêng cho người thương.</p>
          </div>

          <div className="gift-bridge" aria-label="Từ người gửi, qua LIS BY LII, đến người nhận">
            <Link href="#tao-loi-chuc" className="journey-card journey-sender">
              <span className="journey-index">01</span>
              <span className="journey-kicker">Bạn muốn gửi</span>
              <strong>Viết lời chúc</strong>
              <span className="journey-note">Cho món quà bạn sắp trao</span>
              <ArrowUpRight className="journey-arrow" size={20} aria-hidden="true" />
            </Link>

            <div className="brand-passage">
              <span className="passage-line" aria-hidden="true" />
              <div className="brand-portrait">
                <Image
                  src="/brand/lis-by-lii-mark.png"
                  alt="Biểu tượng LIS BY LII trên nền nhung đỏ burgundy"
                  fill
                  priority
                  sizes="(max-width: 767px) 68vw, 310px"
                  className="object-cover"
                />
              </div>
              <LisBrand className="hero-brand-signature" />
              <span className="passage-line" aria-hidden="true" />
            </div>

            <Link href="/mo-qua" className="journey-card journey-recipient">
              <span className="journey-index">02</span>
              <span className="journey-kicker">Bạn đang nhận</span>
              <strong>Mở lời nhắn</strong>
              <span className="journey-note">Một điều riêng đang chờ bạn</span>
              <ArrowUpRight className="journey-arrow" size={20} aria-hidden="true" />
            </Link>
          </div>

          <a href="#tao-loi-chuc" className="hero-scroll">
            Bắt đầu viết <ArrowDown size={15} aria-hidden="true" />
          </a>
        </section>

        <CreateFlow />
      </main>
      <footer className="site-footer">
        <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <LisBrand compact />
          <p>Gói trọn lời yêu thương trong từng món quà <HeartStraight size={15} weight="fill" aria-hidden="true" /></p>
        </div>
      </footer>
    </>
  );
}
