"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, WarningCircle } from "@phosphor-icons/react";
import { EnvelopeReveal } from "./envelope-reveal";
import { FloralArt } from "./floral-art";
import { LisBrand } from "./lis-brand";

type Gift = {
  recipientName: string;
  senderName?: string;
  hideSender: boolean;
  message: string;
  theme?: string;
};

export function RecipientFlow({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const claimingRef = useRef(false);

  function focusBox(index: number) {
    inputRefs.current[Math.max(0, Math.min(5, index))]?.focus();
  }

  useEffect(() => {
    if (initialCode.length === 6) {
      executeClaim(initialCode);
    }
  }, [initialCode]);

  async function executeClaim(targetCode: string) {
    const clean = targetCode.replace(/\D/g, "").slice(0, 6);
    setError("");
    if (clean.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số trên thiệp.");
      focusBox(clean.length);
      return;
    }
    if (claimingRef.current) return;
    claimingRef.current = true;
    setIsLoading(true);
    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: clean }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Mã không chính xác");
      setGift(result.gift);
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Không tìm thấy lời nhắn. Vui lòng kiểm tra lại mã trên thiệp."
      );
      focusBox(0);
    } finally {
      setIsLoading(false);
      claimingRef.current = false;
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeClaim(code);
  }

  // code is always kept contiguous (no gaps), so code[index] maps to box index
  function handleBoxChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    let next: string;
    let focusIndex = index;
    if (digit) {
      if (index > code.length) {
        next = (code + digit).slice(0, 6);
        focusIndex = Math.min(next.length, 5);
      } else {
        next = (code.slice(0, index) + digit + code.slice(index + 1)).slice(0, 6);
        focusIndex = Math.min(index + 1, 5);
      }
    } else {
      next = code.slice(0, index) + code.slice(index + 1);
    }
    setCode(next);
    setError("");
    focusBox(focusIndex);
    if (digit && next.length === 6) executeClaim(next);
  }

  function handleBoxKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault();
      setCode(code.slice(0, index - 1) + code.slice(index));
      setError("");
      focusBox(index - 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = (event.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    setCode(digits);
    setError("");
    if (digits.length === 6) executeClaim(digits);
    else focusBox(digits.length);
  }

  function handleReset() {
    setGift(null);
    setCode("");
    setError("");
    window.setTimeout(() => focusBox(0), 100);
  }

  if (gift) {
    return (
      <section className="section-shell max-w-lg py-8 md:py-16 relative overflow-x-clip">
        <FloralArt className="bg-floral-art bg-floral-right opacity-30" decorative />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              className="btn-ghost text-xs min-h-9 px-3.5"
              onClick={handleReset}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Nhập mã khác</span>
            </button>
            <LisBrand compact />
          </div>

          <div className="paper-card p-6 sm:p-8">
            <EnvelopeReveal gift={gift} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell max-w-md py-8 sm:py-14 relative overflow-x-clip">
      <FloralArt className="bg-floral-art bg-floral-left opacity-25" decorative />
      <FloralArt className="bg-floral-art bg-floral-right opacity-20" decorative />

      <div className="paper-card p-5 sm:p-8 text-center relative overflow-hidden z-10">
        {/* Brand Header */}
        <div className="mb-5 flex justify-center">
          <LisBrand />
        </div>

        {/* Circular flower — blended, no white box */}
        <div className="relative mx-auto size-24 sm:size-28 rounded-full overflow-hidden bg-[var(--rose-soft)] border border-[var(--line)] mb-5">
          <Image
            src="/images/calla-lily-single.jpg"
            alt="Hoa Rum hồng LIS"
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>

        {/* Headings matching mockup screen 4 */}
        <div className="space-y-2 mb-6 px-1">
          <h1 className="font-display italic text-2xl sm:text-[1.7rem] font-medium text-[var(--ink)] text-balance leading-snug">
            Bạn có một<br />
            <span className="text-[var(--rose-dark)]">lời nhắn kèm món quà</span>
          </h1>
          <p className="text-[13px] sm:text-sm text-[var(--muted)] text-balance leading-relaxed">
            Nhập mã trên tấm thiệp để mở lời nhắn.
          </p>
        </div>

        {/* 6 Digit Input Form — 6 real inputs so mobile keyboards work */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div
            className="code-grid"
            role="group"
            aria-label="Mã mở thư gồm 6 chữ số"
          >
            {Array.from({ length: 6 }, (_, index) => {
              const char = code[index] || "";
              const isCurrent = index === code.length && code.length < 6;
              return (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className={`code-tile ${char ? "is-filled" : ""} ${
                    isCurrent ? "is-active" : ""
                  }`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  autoFocus={index === 0}
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleBoxChange(index, e.target.value)}
                  onKeyDown={(e) => handleBoxKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Chữ số thứ ${index + 1} của mã 6 số`}
                />
              );
            })}
          </div>

          {error && (
            <p className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-red-600 bg-red-50/80 border border-red-200 py-2 px-3 rounded-xl">
              <WarningCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <button
            className="btn-teal w-full text-sm font-semibold"
            type="submit"
            disabled={isLoading || code.length !== 6}
          >
            <span>{isLoading ? "Đang mở thư…" : "Mở lời nhắn"}</span>
            {!isLoading && <ArrowUpRight size={17} />}
          </button>

          <div className="px-1 pt-1">
            <p className="text-xs text-[var(--muted)] text-balance leading-relaxed">
              Nhập sai mã?{" "}
              <span className="text-[var(--ink)] font-medium">
                Vui lòng kiểm tra lại mã trên tấm thiệp.
              </span>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
