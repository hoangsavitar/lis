"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  ArrowClockwise,
  CaretDown,
  LockKey,
  QrCode,
  Sparkle,
  Handbag,
} from "@phosphor-icons/react";

type Gift = {
  recipientName: string;
  senderName?: string;
  hideSender: boolean;
  message: string;
};

// 18 particles radiating in a 360-degree celebration burst
const BURST_PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * 360;
  const rad = (angle * Math.PI) / 180;
  const distance = 95 + (i % 3) * 35;
  const targetX = Math.cos(rad) * distance;
  const targetY = Math.sin(rad) * distance - 25;
  const isGold = i % 3 === 0;
  const isPetal = i % 3 === 1;
  return { id: i, targetX, targetY, isGold, isPetal, size: isGold ? 10 : 14 };
});

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
  const particlesRef = useRef<HTMLDivElement>(null);
  const letterSlideRef = useRef<HTMLDivElement>(null);

  // Floating heartbeat glow on wax seal before opening
  useEffect(() => {
    if (isOpen || isOpening) return;
    const seal = sealRef.current;
    if (!seal) return;

    const tween = gsap.to(seal, {
      scale: 1.08,
      boxShadow: "0 12px 30px rgba(212, 130, 142, 0.6)",
      duration: 1.4,
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
    setIsOpening(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setIsOpening(false);
        onOpenChange?.(true);
      },
    });

    // Step 1: Wax seal pops with scale & golden flash
    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1.35,
        opacity: 0,
        duration: 0.35,
        ease: "back.out(2)",
      });
    }

    // Step 2: 18 Particles burst outwards in a radial fountain
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll(".burst-particle");
      tl.fromTo(
        particles,
        { scale: 0, opacity: 1, x: 0, y: 0 },
        {
          x: (i) => BURST_PARTICLES[i].targetX,
          y: (i) => BURST_PARTICLES[i].targetY,
          scale: (i) => (BURST_PARTICLES[i].isGold ? 1.2 : 1),
          opacity: 0,
          duration: 1.1,
          stagger: 0.015,
          ease: "power3.out",
        },
        "<0.05"
      );
    }

    // Step 3: 3D Top flap flips open 180 degrees
    if (flapRef.current) {
      tl.to(
        flapRef.current,
        {
          rotateX: 180,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "<0.1"
      );
    }

    // Step 4: Inner letter emerges upwards with bounce
    if (letterSlideRef.current) {
      tl.to(
        letterSlideRef.current,
        {
          y: -125,
          scale: 1.04,
          duration: 0.85,
          ease: "back.out(1.25)",
        },
        "<0.2"
      );
    }

    // Step 5: Envelope dissolves into full stationery letter
    if (envelopeRef.current) {
      tl.to(
        envelopeRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.45,
          ease: "power2.in",
        },
        "+=0.15"
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
    <div ref={containerRef} className="w-full max-w-md mx-auto space-y-7">
      {/* Recipient Greeting Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(253,242,244,0.85)] border border-[rgba(212,130,142,0.2)] text-[11px] font-semibold tracking-wider text-[var(--rose-dark)] uppercase">
          <Handbag size={13} className="text-[var(--rose)]" weight="duotone" />
          <span>Món quà túi xách LIS</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] flex items-center justify-center gap-2">
          <span>Dành cho {gift.recipientName}</span>
          <span className="text-[var(--rose)]">♡</span>
        </h2>
      </div>

      {/* STATE 1: Interactive Envelope with Mathematically Locked Wax Seal & WOW Particles */}
      {!isOpen && (
        <div className="relative flex flex-col items-center py-6">
          {/* Particle Burst Layer */}
          <div
            ref={particlesRef}
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
            aria-hidden="true"
          >
            {BURST_PARTICLES.map((p) => (
              <span
                key={p.id}
                className="burst-particle absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.isGold
                    ? "radial-gradient(circle, #fef08a, #d97706)"
                    : p.isPetal
                    ? "radial-gradient(circle, #fce7f3, #e11d48)"
                    : "radial-gradient(circle, #fff, #f43f5e)",
                  boxShadow: p.isGold
                    ? "0 0 12px rgba(251, 191, 36, 0.9)"
                    : "0 0 10px rgba(244, 63, 94, 0.7)",
                  opacity: 0,
                }}
              />
            ))}
          </div>

          {/* 3D Envelope Container */}
          <div
            ref={envelopeRef}
            className="envelope-container relative w-full max-w-[330px] aspect-[1.48/1] rounded-2xl bg-[#7aa69e] shadow-[0_20px_50px_rgba(90,135,126,0.35)] overflow-hidden cursor-pointer group select-none"
            onClick={handleOpen}
            style={{
              perspective: "1000px",
              // Define CSS variables for zero-deviation geometry
              // @ts-expect-error CSS variable
              "--apex-x": APEX_X,
              "--apex-y": APEX_Y,
            }}
          >
            {/* 1. Inner Silk Lining (Backing) */}
            <div className="absolute inset-0 bg-[#69938c]" />

            {/* 2. Inner Letter Card (Peeking out) */}
            <div
              ref={letterSlideRef}
              className="absolute left-[7%] right-[7%] top-[12%] h-[72%] bg-[#fffdf9] rounded-t-xl shadow-md border-t border-[rgba(212,130,142,0.25)] flex flex-col items-center pt-3 px-4 text-center z-10"
              style={{ willChange: "transform" }}
            >
              <div className="w-10 h-1 rounded-full bg-[rgba(212,130,142,0.3)] mb-2" />
              <p className="font-display italic text-xs text-[var(--rose-dark)] font-semibold">
                Dear {gift.recipientName},
              </p>
              <p className="text-[11px] text-[var(--muted)] line-clamp-1 mt-1 opacity-70">
                {gift.message}
              </p>
            </div>

            {/* 3. Left, Right & Bottom Envelope Pockets (Fold lines meet at EXACT apex-x and apex-y) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: "linear-gradient(160deg, #88b3ab, #66948c)",
                clipPath: `polygon(0% 0%, ${APEX_X} ${APEX_Y}, 100% 0%, 100% 100%, 0% 100%)`,
                boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.25)",
              }}
            />

            {/* 4. 3D Top Flap (Flap vertex reaches EXACTLY to apex-x and apex-y) */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 w-full z-30 pointer-events-none"
              style={{
                height: APEX_Y,
                transformOrigin: "top center",
                background: "linear-gradient(180deg, #99c2b9, #7aa69e)",
                clipPath: `polygon(0% 0%, 100% 0%, ${APEX_X} 100%)`,
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
                willChange: "transform",
              }}
            />

            {/* 5. Pink Wax Seal - Mathematically LOCKED to apex-x and apex-y fold line */}
            <button
              ref={sealRef}
              type="button"
              className="absolute z-40 size-16 rounded-full cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-[0_8px_24px_rgba(180,60,80,0.45)]"
              style={{
                left: APEX_X,
                top: APEX_Y,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              aria-label="Chạm vào con dấu sáp để mở bức thư"
            >
              <div className="relative size-full rounded-full bg-gradient-to-br from-[#ECA4AF] via-[#D4828E] to-[#AD5061] p-1 flex items-center justify-center ring-2 ring-white/70 border border-[rgba(255,255,255,0.6)] shadow-inner">
                <div className="size-full rounded-full border border-dashed border-white/80 flex items-center justify-center bg-[rgba(212,130,142,0.25)] shadow-inner">
                  <span className="font-display font-bold text-lg tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] pl-0.5 select-none">
                    LIS
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Interactive CTA Prompt */}
          <button
            type="button"
            onClick={handleOpen}
            className="mt-6 inline-flex flex-col items-center gap-1.5 text-[var(--ink)] hover:text-[var(--rose-dark)] transition-colors cursor-pointer group"
          >
            <span className="font-display italic text-lg text-[var(--ink)] group-hover:text-[var(--rose-dark)] flex items-center gap-1.5">
              <span>Chạm con dấu để mở thư</span>
              <Sparkle size={16} className="text-[var(--gold)]" weight="fill" />
            </span>
            <CaretDown
              size={18}
              className="text-[var(--rose)] animate-bounce"
              weight="bold"
            />
          </button>
        </div>
      )}

      {/* STATE 2: Full Stationery Letter Card with Shimmer & Typography */}
      {isOpen && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="stationery-card relative w-full bg-[#fffdf9] rounded-2xl p-6 sm:p-9 shadow-2xl border border-[rgba(212,130,142,0.25)]">
            {/* Delicate Floral Watermark in corner */}
            <div className="pointer-events-none absolute right-3 bottom-3 w-28 opacity-25">
              <Image
                src="/images/calla-lily-single.jpg"
                alt=""
                width={140}
                height={140}
                className="object-contain -rotate-12"
              />
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(212,130,142,0.15)] pb-3">
                <p className="font-display text-2xl sm:text-3xl italic text-[var(--rose-dark)] font-medium">
                  Dear {gift.recipientName},
                </p>
                <span className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
                  LIS Gift Letter
                </span>
              </div>

              <div className="py-2">
                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[var(--ink)] font-normal">
                  {gift.message}
                </p>
              </div>

              <div className="pt-4 border-t border-[rgba(212,130,142,0.12)] text-right">
                <p className="text-sm sm:text-base font-semibold text-[var(--rose-dark)]">
                  Yêu thương, {gift.hideSender ? "Một người thương bạn" : gift.senderName || "LIS"}
                  <span className="ml-1.5 text-[var(--rose)]">♡</span>
                </p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">
                  Đính kèm cùng món quà túi xách LIS
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

      {/* Trust & Security feature badges (Product: Handbag + Digital Gifting) */}
      <div className="pt-4 border-t border-[rgba(212,130,142,0.18)] space-y-2.5">
        <div className="feature-pill">
          <div className="feature-pill-icon">
            <Handbag size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Món quà túi xách LIS trao tay
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Chiếc túi trao gửi cùng bức thư số giấu kín
            </p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <LockKey size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Mỗi lời nhắn được mã hoá riêng
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Chỉ bạn và người tặng biết nội dung
            </p>
          </div>
        </div>

        <div className="feature-pill">
          <div className="feature-pill-icon">
            <QrCode size={18} weight="duotone" />
          </div>
          <div>
            <p className="font-semibold text-xs text-[var(--ink)]">
              Quét mã QR trên thiệp kèm túi
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Mở bức thư số trên mọi thiết bị di động
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
