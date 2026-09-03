"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  ArrowClockwise,
  CaretDown,
  Heart,
  Key,
  LockKey,
  QrCode,
  Sparkle,
} from "@phosphor-icons/react";

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
  const [isOpening, setIsOpening] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const letterSlideRef = useRef<HTMLDivElement>(null);

  // Gentle seal glow before opening — disabled with reduced motion
  useEffect(() => {
    if (isOpen || isOpening) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seal = sealRef.current;
    if (!seal) return;

    const tween = gsap.to(seal, {
      scale: 1.05,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [isOpen, isOpening]);

  function handleOpen() {
    if (isOpen || isOpening) return;
    // Reduced motion: open instantly, one calm state change
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsOpen(true);
      onOpenChange?.(true);
      return;
    }
    setIsOpening(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setIsOpening(false);
        onOpenChange?.(true);
      },
    });

    // Step 1: Wax seal pops softly
    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1.25,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // Step 2: Top flap opens — single spatial motion
    if (flapRef.current) {
      tl.to(
        flapRef.current,
        {
          rotateX: 180,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "<0.05"
      );
    }

    // Step 3: Letter rises gently
    if (letterSlideRef.current) {
      tl.to(
        letterSlideRef.current,
        {
          y: -110,
          duration: 0.7,
          ease: "power2.out",
        },
        "<0.15"
      );
    }

    // Step 4: Envelope fades into stationery
    if (envelopeRef.current) {
      tl.to(
        envelopeRef.current,
        {
          opacity: 0,
          y: 12,
          duration: 0.4,
          ease: "power2.in",
        },
        "+=0.1"
      );
    }
  }

  function handleReplay() {
    setIsOpen(false);
    setIsOpening(false);
    onOpenChange?.(false);

    window.setTimeout(() => {
      if (sealRef.current && flapRef.current && envelopeRef.current && letterSlideRef.current) {
        gsap.set(sealRef.current, { scale: 1, opacity: 1 });
        gsap.set(flapRef.current, { rotateX: 0 });
        gsap.set(envelopeRef.current, { scale: 1, y: 0, opacity: 1 });
        gsap.set(letterSlideRef.current, { y: 0, scale: 1 });
      }
    }, 50);
  }

  // SINGLE SOURCE OF TRUTH FOR FLAP & CREASE GEOMETRY
  // Changing these 2 values will automatically lock Flap Tip, Pocket Crease, and Wax Seal together!
  const APEX_X = "50%";
  const APEX_Y = "54%";

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto space-y-6">
      {/* Recipient Greeting Header */}
      <div className="text-center space-y-1.5 px-2">
        <h2 className="font-display italic text-2xl sm:text-[1.7rem] font-medium text-[var(--ink)] flex items-center justify-center gap-1.5 text-balance">
          <span>Dành cho {gift.recipientName}</span>
          <Heart size={16} weight="fill" className="text-[var(--rose)] shrink-0" aria-hidden="true" />
        </h2>
      </div>

      {/* STATE 1: Calm envelope like mockup */}
      {!isOpen && (
        <div className="relative flex flex-col items-center py-4">
          {/* Sage Envelope Container — keyboard accessible */}
          <div
            ref={envelopeRef}
            className="envelope-container relative w-full max-w-[320px] aspect-[1.5/1] rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(160deg, #B9D2CE, #9ABEB9)",
              boxShadow: "0 12px 28px rgba(92,139,134,0.22)",
              perspective: "1000px",
              // @ts-expect-error CSS variable
              "--apex-x": APEX_X,
              "--apex-y": APEX_Y,
            }}
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Mở phong bì để đọc thư"
          >
            {/* 1. Inner lining */}
            <div className="absolute inset-0" style={{ background: "#A9C4BE" }} />

            {/* 2. Inner Letter Card peeking */}
            <div
              ref={letterSlideRef}
              className="absolute left-[7%] right-[7%] top-[12%] h-[72%] bg-[#fffefb] rounded-t-xl border-t border-[var(--line)] flex flex-col items-center pt-3 px-4 text-center z-10"
              style={{ willChange: "transform" }}
            >
              <div className="w-10 h-1 rounded-full bg-[rgba(196,126,138,0.25)] mb-2" />
              <p className="font-display italic text-xs text-[var(--rose-dark)] font-medium">
                Dear {gift.recipientName},
              </p>
              <p className="text-[11px] text-[var(--muted)] line-clamp-1 mt-1">
                {gift.message}
              </p>
            </div>

            {/* 3. Envelope pockets */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: "linear-gradient(160deg, #B4CFCB, #93B7B1)",
                clipPath: `polygon(0% 0%, ${APEX_X} ${APEX_Y}, 100% 0%, 100% 100%, 0% 100%)`,
              }}
            />

            {/* 4. Top flap */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 w-full z-30 pointer-events-none"
              style={{
                height: APEX_Y,
                transformOrigin: "top center",
                background: "linear-gradient(180deg, #C3DAD6, #A9C4BE)",
                clipPath: `polygon(0% 0%, 100% 0%, ${APEX_X} 100%)`,
                willChange: "transform",
              }}
            />

            {/* 5. Wax seal */}
            <button
              ref={sealRef}
              type="button"
              className="absolute z-40 size-14 rounded-full cursor-pointer flex items-center justify-center"
              style={{
                left: APEX_X,
                top: APEX_Y,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 6px 18px rgba(168,93,107,0.4)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              aria-label="Chạm vào con dấu sáp để mở bức thư"
            >
              <span className="relative size-full rounded-full p-1 flex items-center justify-center ring-2 ring-white/70 border border-white/60" style={{ background: "linear-gradient(135deg, #D89AA5, #C47E8A 55%, #A85D6B)" }}>
                <span className="size-full rounded-full border border-dashed border-white/80 flex items-center justify-center bg-white/10">
                  <span className="font-display font-semibold text-[13px] tracking-[0.2em] text-white pl-0.5 select-none">
                    LIS
                  </span>
                </span>
              </span>
            </button>
          </div>

          {/* Interactive CTA Prompt */}
          <button
            type="button"
            onClick={handleOpen}
            className="mt-5 inline-flex min-h-11 flex-col items-center justify-center gap-0.5 px-4 text-[var(--ink)]"
            aria-label="Chạm để mở thư"
          >
            <span className="font-display italic text-lg flex items-center gap-1.5">
              <span>Nhấn để mở thư</span>
              <Sparkle size={15} className="text-[var(--gold)]" weight="fill" aria-hidden="true" />
            </span>
            <CaretDown
              size={16}
              className="text-[var(--rose)]"
              weight="bold"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* STATE 2: Full Stationery Letter Card */}
      {isOpen && (
        <div className="space-y-5">
          <div className="stationery-card relative w-full rounded-2xl p-5 sm:p-7 border border-[var(--line)]" style={{ boxShadow: "var(--shadow-card)" }}>
            {/* Delicate Floral Watermark in corner */}
            <div className="pointer-events-none absolute right-3 bottom-3 w-24 opacity-30" aria-hidden="true">
              <Image
                src="/images/calla-lily-single.jpg"
                alt=""
                width={120}
                height={120}
                className="rounded-full object-cover -rotate-12"
              />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-baseline justify-between gap-3 border-b border-[rgba(196,126,138,0.15)] pb-3">
                <p className="font-display text-xl sm:text-2xl italic text-[var(--rose-dark)] font-medium text-balance">
                  Dear {gift.recipientName},
                </p>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] shrink-0">
                  LIS Gift Letter
                </span>
              </div>

              <div className="py-1">
                <p className="whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed text-[var(--ink)]">
                  {gift.message}
                </p>
              </div>

              <div className="pt-3 border-t border-[rgba(196,126,138,0.12)] text-right">
                <p className="text-sm sm:text-[15px] font-semibold text-[var(--rose-dark)] flex items-center justify-end gap-1">
                  <span>Yêu thương, {gift.hideSender ? "Một người thương bạn" : gift.senderName || "LIS"}</span>
                  <Heart size={14} weight="fill" className="text-[var(--rose)]" aria-hidden="true" />
                </p>
              </div>
            </div>
          </div>

          {/* Replay action */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleReplay}
              className="btn-ghost text-xs min-h-9 px-5 rounded-full inline-flex items-center gap-2 shadow-xs"
            >
              <ArrowClockwise size={14} />
              <span>Đóng và xem lại mở thư</span>
            </button>
          </div>
        </div>
      )}

      {/* Trust badges like mockup */}
      <div className="pt-4 border-t border-[rgba(196,126,138,0.18)] space-y-2.5">
        <div className="feature-pill">
          <div className="feature-pill-icon">
            <LockKey size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Mỗi lời nhắn được mã hóa riêng
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Chỉ bạn và người gửi biết nội dung
            </p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <QrCode size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Quét mã QR chung trên thiệp
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Mở lời nhắn trên mọi thiết bị
            </p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <Key size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Nhập mã truy cập
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Để mở lời nhắn chỉ dành cho bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
