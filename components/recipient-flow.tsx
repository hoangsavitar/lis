
"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, WarningCircle } from "@phosphor-icons/react";
import { EnvelopeReveal } from "./envelope-reveal";
import { FloralArt } from "./floral-art";
import { LisBrand } from "./lis-brand";

type Gift = { recipientName: string; senderName?: string; hideSender: boolean; message: string; theme?: string };

export function RecipientFlow() {
  const [code, setCode] = useState("");
  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function claim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Mã gồm 6 chữ số.");
      inputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Mã chưa đúng");
      setGift(result.gift);
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "Không thể mở lời chúc, thử lại nhé.");
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setGift(null);
    setIsLetterOpen(false);
    setCode("");
    setError("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  if (gift) {
    return (
      <section className="recipient-page section-shell max-w-[680px] py-6 md:py-12">
        <button type="button" className="btn-ghost mb-5 min-h-10 px-4 text-xs" onClick={reset}><ArrowLeft size={15} aria-hidden="true" /> Nhập mã khác</button>
        <div className={`paper-card recipient-letter-card p-4 md:p-7 ${isLetterOpen ? "is-letter-open" : ""}`}>
          <div className="recipient-letter-brand"><LisBrand className="recipient-brand" /></div>
          <div className="mb-6 text-center">
            <p className="eyebrow">Dành cho {gift.recipientName}</p>
            <h1 className="font-display mt-3 text-4xl text-[var(--ink)] md:text-5xl">Lời thương đã đến</h1>
          </div>
          <EnvelopeReveal gift={gift} onOpenChange={setIsLetterOpen} />
        </div>
      </section>
    );
  }

  return (
    <section className="recipient-page section-shell max-w-[680px] py-4 md:py-10">
      <div className="recipient-screen">
        <div className="recipient-screen-orbit" aria-hidden="true" />
        <FloralArt className="recipient-screen-flower" decorative />
        <div className="recipient-screen-content">
          <LisBrand className="recipient-brand" />
          <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.045em] text-[var(--ink)] md:text-6xl">Một lời riêng<br /><em className="text-[var(--rose)]">đang chờ bạn.</em></h1>

          <form onSubmit={claim} className={`mt-10 w-full ${error ? "form-shake" : ""}`}>
            <label className="sr-only" htmlFor="claimCode">Mã nhận lời chúc</label>
            <div className="code-entry">
              <div className="code-grid" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => <span key={index} className={`code-input-tile ${code[index] ? "is-filled" : ""}`}>{code[index] || ""}</span>)}
              </div>
              <input
                ref={inputRef}
                id="claimCode"
                className="code-input-overlay"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                autoFocus
                aria-describedby={error ? "claim-error" : undefined}
              />
            </div>
            {error && <p id="claim-error" className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--rose)]" role="alert"><WarningCircle size={16} aria-hidden="true" /> {error}</p>}
            <button className="btn-primary mt-6 w-full" type="submit" disabled={isLoading}>{isLoading ? "Đang mở…" : "Mở lời nhắn"} {!isLoading && <ArrowUpRight size={17} aria-hidden="true" />}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
