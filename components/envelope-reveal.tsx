"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowClockwise, Heart, Sparkle } from "@phosphor-icons/react";

type Gift = {
  recipientName: string;
  senderName?: string;
  hideSender: boolean;
  message: string;
  theme?: string;
};

export function EnvelopeReveal({ gift, onOpenChange }: { gift: Gift; onOpenChange?: (isOpen: boolean) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const openFrameRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(letterRef.current, { y: 84, rotate: 0 });
      gsap.set(flapRef.current, { rotateX: 0 });
      gsap.set(sealRef.current, { scale: 1, opacity: 1 });
      gsap.set(sparkleRef.current, { opacity: 0 });
      if (reduceMotion) return;
      gsap.fromTo(root, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
      const glow = root.querySelector(".reveal-glow");
      if (glow) gsap.to(glow, { scale: 1.12, opacity: 0.72, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  function openEnvelope() {
    if (isOpen) return;
    setIsOpen(true);
    onOpenChange?.(true);
    if (!rootRef.current) return;
    openFrameRef.current = window.requestAnimationFrame(() => {
      if (!rootRef.current || !letterRef.current) return;
      const stage = rootRef.current.querySelector<HTMLElement>(".reveal-stage");
      const stageHeight = stage?.getBoundingClientRect().height || 460;
      const letterHeight = letterRef.current.getBoundingClientRect().height;
      const letterTop = Number.parseFloat(window.getComputedStyle(letterRef.current).top) || 0;
      const openLetterY = Math.max(24, (stageHeight - letterHeight) / 2 - letterTop);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      if (reduceMotion) {
        gsap.set(letterRef.current, { y: openLetterY, rotate: -1 });
        gsap.set(flapRef.current, { rotateX: -174 });
        gsap.set(sealRef.current, { scale: 0.7, opacity: 0 });
        return;
      }
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.to(sealRef.current, { scale: 1.18, duration: 0.24, ease: "back.out(2)" })
        .to(sealRef.current, { scale: 0.7, opacity: 0, duration: 0.25 }, "<0.1")
        .to(flapRef.current, { rotateX: -174, duration: 0.68, ease: "power2.inOut" }, "<0.06")
        .to(letterRef.current, { y: openLetterY, rotate: -1.2, duration: 1.15, ease: "back.out(1.3)" }, "<0.24")
        .to(sparkleRef.current, { opacity: 1, duration: 0.35 }, "<0.35")
        .fromTo(rootRef.current.querySelectorAll(".letter-reveal"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.48, stagger: 0.07 }, "<0.18");
    });
  }

  function replay() {
    if (openFrameRef.current) window.cancelAnimationFrame(openFrameRef.current);
    setIsOpen(false);
    onOpenChange?.(false);
    window.setTimeout(() => {
      if (letterRef.current) gsap.set(letterRef.current, { y: 84, rotate: 0 });
      if (flapRef.current) gsap.set(flapRef.current, { rotateX: 0 });
      if (sealRef.current) gsap.set(sealRef.current, { scale: 1, opacity: 1 });
      if (sparkleRef.current) gsap.set(sparkleRef.current, { opacity: 0 });
    }, 10);
  }

  return (
    <div ref={rootRef} className={`space-y-5 ${isOpen ? "is-open" : ""}`}>
      <div className={`reveal-stage ${isOpen ? "is-open" : ""} theme-${gift.theme || "botanical"}`}>
        <div className="reveal-glow" />
        <div ref={sparkleRef} className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true"><Sparkle className="absolute left-[18%] top-[24%] text-white/80" size={18} /><Sparkle className="absolute right-[20%] top-[29%] text-white/80" size={13} /><Sparkle className="absolute bottom-[22%] left-[26%] text-white/70" size={11} /></div>
        <div ref={letterRef} className="letter-card">
          <div className="letter-reveal opacity-0"><p className="font-display text-xl italic text-[var(--rose)]">Dear {gift.recipientName},</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{gift.message}</p><p className="mt-4 font-display text-lg text-[var(--rose)]">{gift.hideSender ? "Một người thương bạn" : gift.senderName || "Một người thương bạn"} <Heart className="ml-1 inline text-[var(--rose)]" size={15} weight="fill" aria-hidden="true" /></p></div>
        </div>
        <div className="envelope-shell floating-envelope">
          <div className="envelope-back" />
          <div ref={flapRef} className="envelope-flap" />
          <div className="envelope-front" />
          <button ref={sealRef} type="button" className="seal cursor-pointer" onClick={openEnvelope} aria-label={isOpen ? "Thư đã mở" : "Chạm để mở thư"} disabled={isOpen}>
            <Image src="/brand/lis-by-lii-mark.png" alt="" fill sizes="77px" className="seal-image" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-7 z-20 text-center"><p className="reveal-status text-xs font-semibold uppercase tracking-[0.16em] text-white/85">{isOpen ? "Một điều được gửi bằng cả tấm lòng" : "Chạm vào con dấu để mở"}</p></div>
      </div>
      {isOpen && <div className="flex justify-center rounded-2xl border border-[var(--line)] bg-[rgba(255,253,251,0.62)] p-4">
        <button type="button" className="btn-ghost min-h-10 px-4 text-xs" onClick={replay}><ArrowClockwise size={15} aria-hidden="true" /> Xem lại</button>
      </div>}
    </div>
  );
}
