"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, WarningCircle } from "@phosphor-icons/react";
import { EnvelopeReveal } from "./envelope-reveal";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCode.length === 6) {
      executeClaim(initialCode);
    }
  }, [initialCode]);

  async function executeClaim(targetCode: string) {
    setError("");
    if (targetCode.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số trên thiệp.");
      inputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: targetCode }),
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
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeClaim(code);
  }

  function handleInputChange(value: string) {
    const clean = value.replace(/\D/g, "").slice(0, 6);
    setCode(clean);
    setError("");
    if (clean.length === 6) {
      executeClaim(clean);
    }
  }

  function handleReset() {
    setGift(null);
    setCode("");
    setError("");
    window.setTimeout(() => inputRef.current?.focus(), 100);
  }

  if (gift) {
    return (
      <section className="section-shell max-w-lg py-8 md:py-16">
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
      </section>
    );
  }

  return (
    <section className="section-shell max-w-md py-8 sm:py-16">
      <div className="paper-card p-6 sm:p-9 text-center relative overflow-hidden">
        {/* Brand Header */}
        <div className="mb-6 flex justify-center">
          <LisBrand />
        </div>

        {/* Circular Aura with Pink Calla Lily */}
        <div className="relative mx-auto size-28 sm:size-32 rounded-full bg-[rgba(253,242,244,0.9)] border border-[rgba(212,130,142,0.25)] flex items-center justify-center p-3 shadow-inner mb-6">
          <div className="relative w-full h-full">
            <Image
              src="/images/calla-lily-single.jpg"
              alt="Hoa Rum hồng LIS"
              fill
              sizes="128px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Headings matching mockup screen 4 */}
        <div className="space-y-2 mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            Bạn có một<br />
            <span className="text-[var(--rose-dark)]">lời nhắn dành cho bạn</span>
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Nhập mã trên tấm thiệp để mở lời nhắn.
          </p>
        </div>

        {/* 6 Digit Input Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div
            className="relative cursor-pointer"
            onClick={() => inputRef.current?.focus()}
          >
            {/* 6 Interactive Tiles */}
            <div className="code-grid" aria-hidden="true">
              {Array.from({ length: 6 }, (_, index) => {
                const char = code[index] || "";
                const isCurrent = index === code.length && code.length < 6;
                return (
                  <span
                    key={index}
                    className={`code-tile ${char ? "is-filled" : ""} ${
                      isCurrent ? "is-active" : ""
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Hidden Input for Mobile Keypad */}
            <input
              ref={inputRef}
              id="claimCode"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full text-center"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => handleInputChange(e.target.value)}
              autoFocus
              aria-label="Nhập 6 số mã mở thư"
            />
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
            <span>{isLoading ? "Đang kiểm tra…" : "Mở lời nhắn"}</span>
            {!isLoading && <ArrowUpRight size={17} />}
          </button>

          <div className="pt-2">
            <p className="text-xs text-[var(--muted)]">
              Nhập sai mã?{" "}
              <span className="block sm:inline text-[var(--ink)] font-medium">
                Vui lòng kiểm tra lại mã trên tấm thiệp.
              </span>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
