"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowClockwise, CaretDown, Heart, LockKey, QrCode, Key, Sparkle } from "@phosphor-icons/react";

type Gift = {
  recipientName: string;
  senderName?: string;
  hideSender: boolean;
  message: string;
};

export function EnvelopeReveal({
  gift,
  onOpenChange,
}: {
  gift: Gift;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const letterCardRef = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLDivElement>(null);
  const sealButtonRef = useRef<HTMLButtonElement>(null);

  function handleOpen() {
    if (isOpen) return;
    setIsOpen(true);
    onOpenChange?.(true);

    if (letterCardRef.current && envelopeFlapRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(sealButtonRef.current, { scale: 0.8, opacity: 0, duration: 0.25 })
        .to(envelopeFlapRef.current, { rotateX: 180, duration: 0.6, ease: "power2.inOut" }, "<0.1")
        .to(letterCardRef.current, {
          y: -140,
          scale: 1.02,
          duration: 0.8,
          ease: "back.out(1.2)",
        }, "<0.2")
        .fromTo(
          ".letter-content-fade",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
    }
  }

  function handleReplay() {
    setIsOpen(false);
    onOpenChange?.(false);
    if (letterCardRef.current && envelopeFlapRef.current && sealButtonRef.current) {
      gsap.set(letterCardRef.current, { y: 0, scale: 1 });
      gsap.set(envelopeFlapRef.current, { rotateX: 0 });
      gsap.set(sealButtonRef.current, { scale: 1, opacity: 1 });
    }
  }

  return (
    <div ref={rootRef} className="w-full max-w-md mx-auto space-y-8">
      {/* Recipient Greeting Header */}
      <div className="text-center space-y-1">
        <p className="eyebrow text-xs uppercase tracking-[0.2em]">Dành cho</p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] flex items-center justify-center gap-2">
          <span>{gift.recipientName}</span>
          <span className="text-[var(--rose)]">♡</span>
        </h2>
      </div>

      {/* Interactive Envelope Ritual */}
      <div className="relative pt-24 pb-4 flex flex-col items-center">
        {/* The Emerging Letter Card */}
        <div
          ref={letterCardRef}
          className={`stationery-card w-full max-w-sm z-10 transition-all ${
            isOpen ? "shadow-2xl" : "shadow-md"
          }`}
          style={{ willChange: "transform" }}
        >
          {/* Subtle floral watermark in letter */}
          <div className="pointer-events-none absolute right-2 bottom-2 w-20 opacity-25">
            <Image
              src="/images/calla-lily-single.jpg"
              alt=""
              width={100}
              height={100}
              className="object-contain -rotate-12"
            />
          </div>

          <div className="space-y-4">
            <p className="font-display text-xl sm:text-2xl italic text-[var(--rose-dark)] letter-content-fade">
              Dear {gift.recipientName},
            </p>
            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[var(--ink)] letter-content-fade">
              {gift.message}
            </p>
            <div className="pt-2 text-right letter-content-fade">
              <p className="text-sm font-medium text-[var(--rose-dark)]">
                Yêu thương, {gift.hideSender ? "Một người thương bạn" : gift.senderName || "LIS"}
                <span className="ml-1 text-[var(--rose)]">♡</span>
              </p>
            </div>
          </div>
        </div>

        {/* Envelope Structure (Sage Teal) */}
        <div className="envelope-box relative -mt-36 z-20">
          <div className="envelope-pocket" />
          <div
            ref={envelopeFlapRef}
            className={`envelope-top-flap ${isOpen ? "is-open" : ""}`}
            style={{ transformOrigin: "top center" }}
          />

          {/* Pink Wax Seal Button */}
          <button
            ref={sealButtonRef}
            type="button"
            className={`wax-seal-btn ${isOpen ? "is-opened" : ""}`}
            onClick={handleOpen}
            aria-label="Nhấn vào con dấu sáp để mở thư"
          >
            <div className="relative w-full h-full rounded-full shadow-lg">
              <Image
                src="/images/pink-wax-seal.jpg"
                alt="Con dấu sáp LIS"
                fill
                sizes="58px"
                className="rounded-full object-cover"
              />
            </div>
          </button>
        </div>

        {/* Prompt below envelope */}
        <div className="text-center mt-6 z-30">
          {!isOpen ? (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex flex-col items-center gap-1 text-[var(--ink)] hover:text-[var(--rose-dark)] transition-colors cursor-pointer group"
            >
              <span className="font-display italic text-lg text-[var(--ink)] group-hover:text-[var(--rose-dark)]">
                Nhấn để mở thư
              </span>
              <CaretDown
                size={18}
                className="text-[var(--rose)] animate-bounce"
                weight="bold"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReplay}
              className="btn-ghost text-xs min-h-9 px-4 rounded-full inline-flex items-center gap-2"
            >
              <ArrowClockwise size={14} />
              <span>Đóng và xem lại mở thư</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen 6 Trust & Features matching mockup */}
      <div className="pt-6 border-t border-[rgba(212,130,142,0.18)] space-y-3">
        <div className="feature-pill">
          <div className="feature-pill-icon">
            <LockKey size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">Mỗi lời nhắn được mã hoá riêng</p>
            <p className="text-[11px] text-[var(--muted)]">Chỉ bạn và người gửi biết nội dung</p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <QrCode size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">Quét mã QR chung trên thiệp</p>
            <p className="text-[11px] text-[var(--muted)]">Dễ dàng mở từ mọi điện thoại</p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <Key size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">Nhập mã truy cập</p>
            <p className="text-[11px] text-[var(--muted)]">Để mở lời nhắn chỉ dành cho bạn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
