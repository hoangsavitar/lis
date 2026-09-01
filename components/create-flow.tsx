"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Copy, DownloadSimple, Eye, QrCode, Sparkle } from "@phosphor-icons/react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { LisBrand } from "./lis-brand";

type Theme = "botanical" | "seafoam" | "rose";

type FormState = {
  recipientName: string;
  senderName: string;
  hideSender: boolean;
  message: string;
  theme: Theme;
};

const initialForm: FormState = {
  recipientName: "Minh Anh",
  senderName: "An",
  hideSender: false,
  message: "Cảm ơn vì em luôn là nguồn động lực và niềm vui mỗi ngày. Chúc em thật nhiều bình yên và những điều dịu dàng.",
  theme: "botanical",
};

const themeOptions: Array<{ value: Theme; label: string; swatch: string }> = [
  { value: "botanical", label: "Nhung đỏ", swatch: "linear-gradient(135deg,#4d0b21,#8b2945)" },
  { value: "seafoam", label: "Ngà champagne", swatch: "linear-gradient(135deg,#d5b47d,#fffaf1)" },
  { value: "rose", label: "Hồng sương", swatch: "linear-gradient(135deg,#c98291,#f9e7e2)" },
];

const previewThemeCopy: Record<Theme, string> = {
  botanical: "Sắc nhung đỏ",
  seafoam: "Sắc ngà champagne",
  rose: "Sắc hồng sương",
};

const commonQrUrl = process.env.NEXT_PUBLIC_COMMON_QR_URL || "http://localhost:3000/mo-qua";

export function CreateFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [code, setCode] = useState("");
  const [manageToken, setManageToken] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectedTheme = themeOptions.find((option) => option.value === form.theme) || themeOptions[0];

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  function goPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.recipientName.trim() || !form.message.trim()) {
      setError("Bạn điền tên người nhận và lời chúc trước nhé.");
      return;
    }
    setStep(2);
  }

  async function createMessage() {
    setError("");
    setIsSaving(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể tạo lời chúc");
      setCode(result.code);
      setManageToken(result.manageToken);
      setStep(3);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Có lỗi xảy ra, thử lại nhé.");
    } finally {
      setIsSaving(false);
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  function downloadQr() {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "lis-by-lii-mo-loi-nhan.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  }

  return (
    <section id="tao-loi-chuc" className="section-shell scroll-mt-24 py-16 md:py-24">
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Góc dành cho người tặng</p>
          <h2 className="font-display mt-3 text-4xl leading-[0.98] tracking-[-0.035em] text-[var(--ink)] md:text-5xl">Tạo lời chúc của bạn</h2>
        </div>
        <p className="create-audience">Ba bước để gửi điều thật lòng</p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className={`paper-card create-preview theme-${form.theme} relative min-h-[620px] overflow-hidden p-6 md:p-8`}>
          <div className="absolute -right-16 -top-10 size-48 rounded-full bg-[rgba(107,21,48,0.12)] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[rgba(185,144,84,0.16)] blur-3xl" />
          <div className="relative z-10 flex items-center justify-between border-b border-[var(--line)] pb-5">
            <LisBrand />
            <span className="font-display text-xs italic tracking-[0.08em] text-[var(--gold)]">{previewThemeCopy[form.theme]}</span>
          </div>
          <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center py-8 text-center">
            <div className="create-gift-mark mb-6">
              <Image src="/brand/lis-by-lii-mark.png" alt="" fill sizes="112px" className="object-cover" />
            </div>
            <p className="eyebrow">Dành cho</p>
            <p className="font-display mt-2 text-3xl text-[var(--ink)]">{form.recipientName || "người đặc biệt"}</p>
            <span className="preview-theme-chip">{selectedTheme.label}</span>
            <div className="mt-6 max-w-xs rounded-2xl border border-[rgba(86,62,56,0.1)] bg-[rgba(255,253,251,0.75)] px-5 py-4 text-left text-sm leading-6 text-[var(--muted)] shadow-sm">
              {form.message || "Lời chúc của bạn sẽ xuất hiện ở đây."}
            </div>
          </div>
        </div>

        <div className="paper-card p-6 md:p-8">
          <div className="create-stepper" aria-label={`Bước ${step} trên 3`}>
            {[{ number: 1, label: "Viết lời" }, { number: 2, label: "Xem lại" }, { number: 3, label: "Hoàn tất" }].map((item) => (
              <div key={item.number} className={`create-step ${item.number <= step ? "is-active" : ""}`}>
                <span className="create-step-number">{item.number}</span><span>{item.label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={goPreview} className="space-y-5">
              <div>
                <p className="eyebrow">Bước 01</p>
                <h3 className="font-display mt-2 text-3xl text-[var(--ink)]">Viết điều bạn muốn nói</h3>
              </div>
              <div>
                <label className="field-label" htmlFor="recipientName">Tên người nhận <span className="text-[var(--rose)]">*</span></label>
                <input className="field-input" id="recipientName" value={form.recipientName} onChange={(event) => setField("recipientName", event.target.value)} placeholder="Ví dụ: Minh Anh" required />
              </div>
              <div>
                <label className="field-label" htmlFor="senderName">Tên người gửi</label>
                <input className="field-input" id="senderName" value={form.senderName} onChange={(event) => setField("senderName", event.target.value)} placeholder="Ví dụ: An" />
              </div>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[var(--muted)]" htmlFor="hideSender">
                <input className="size-4 accent-[var(--rose)]" type="checkbox" id="hideSender" checked={form.hideSender} onChange={(event) => setField("hideSender", event.target.checked)} />
                Ẩn tên người gửi trong thư
              </label>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="field-label mb-0" htmlFor="message">Lời chúc của bạn <span className="text-[var(--rose)]">*</span></label>
                  <span className="text-xs tabular-nums text-[var(--muted)]">{form.message.length}/500</span>
                </div>
                <textarea className="field-input min-h-36 resize-y leading-6" id="message" maxLength={500} value={form.message} onChange={(event) => setField("message", event.target.value)} placeholder="Viết một điều thật lòng..." required />
              </div>
              <fieldset>
                <legend className="field-label">Chọn sắc thái</legend>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => (
                    <button type="button" key={option.value} onClick={() => setField("theme", option.value)} className={`theme-option rounded-xl border p-2 text-left transition-all duration-200 ${form.theme === option.value ? "is-selected" : ""}`} aria-pressed={form.theme === option.value}>
                      <span className={`theme-option-preview theme-option-${option.value}`} style={{ background: option.swatch }}><span>LIS</span></span>
                      <span className="block text-xs font-semibold text-[var(--ink)]">{option.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              {error && <p className="rounded-xl border border-[rgba(155,75,91,0.24)] bg-[rgba(234,200,203,0.22)] px-3 py-2 text-sm text-[var(--rose)]" role="alert">{error}</p>}
              <button className="btn-primary w-full" type="submit">Xem trước <Eye size={17} aria-hidden="true" /></button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow">Bước 02</p>
                <h3 className="font-display mt-2 text-3xl text-[var(--ink)]">Mọi thứ đã vừa ý?</h3>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-[rgba(155,75,91,0.14)] bg-[linear-gradient(135deg,#fff7f3,#f5e1e0)] p-6">
                <div className="absolute -right-8 bottom-0 size-28 rounded-full bg-[rgba(234,200,203,0.68)] blur-2xl" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">Gửi đến</p>
                <p className="font-display mt-2 text-3xl">{form.recipientName}</p>
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{form.message}</p>
                <p className="mt-6 font-display text-lg text-[var(--rose)]">{form.hideSender ? "Một người thương bạn" : form.senderName || "Một người thương bạn"}</p>
              </div>
              {error && <p className="rounded-xl border border-[rgba(155,75,91,0.24)] bg-[rgba(234,200,203,0.22)] px-3 py-2 text-sm text-[var(--rose)]" role="alert">{error}</p>}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button className="btn-ghost flex-1" type="button" onClick={() => setStep(1)}><ArrowLeft size={17} aria-hidden="true" /> Chỉnh sửa</button>
                <button className="btn-primary flex-1" type="button" onClick={createMessage} disabled={isSaving}>{isSaving ? "Đang tạo mã…" : "Xác nhận & tạo mã"} {!isSaving && <ArrowUpRight size={17} aria-hidden="true" />}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full border border-[rgba(47,111,108,0.22)] bg-[rgba(214,230,223,0.66)] text-[var(--teal)]"><Check size={29} weight="bold" aria-hidden="true" /></div>
              <div>
                <p className="eyebrow">Lời chúc đã sẵn sàng</p>
                <h3 className="font-display mt-2 text-3xl text-[var(--ink)]">Gửi mã này cùng món quà</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">Ghi sáu số dưới đây lên tấm thiệp dành cho người nhận.</p>
              </div>
              <div className="rounded-2xl border border-[rgba(155,75,91,0.14)] bg-[rgba(255,247,243,0.8)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">Mã nhận lời chúc</p>
                <p className="my-3 font-mono text-5xl font-semibold tracking-[0.2em] text-[var(--rose)]">{code}</p>
                <button type="button" className="btn-ghost mx-auto min-h-10 px-4 text-xs" onClick={copyCode}>{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />} {copied ? "Đã sao chép" : "Sao chép mã"}</button>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,253,251,0.6)] p-5 text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ink)]"><QrCode size={18} className="text-[var(--rose)]" aria-hidden="true" /> QR mở lời nhắn của LIS BY LII</p>
                <div className="mx-auto my-5 w-fit rounded-2xl border border-[rgba(47,111,108,0.16)] bg-white p-4 shadow-[0_16px_28px_rgba(47,111,108,0.1)]"><QRCodeSVG value={commonQrUrl} size={190} includeMargin level="H" /><div className="pointer-events-none absolute left-[-10000px] top-0 opacity-0" aria-hidden="true"><QRCodeCanvas ref={qrCanvasRef} value={commonQrUrl} size={1024} includeMargin level="H" /></div></div>
                <p className="mx-auto max-w-sm text-xs leading-5 text-[var(--muted)]">Tải một lần để in và đặt kèm các món quà của shop.</p>
                <button type="button" className="btn-secondary mt-4 min-h-11 px-5 text-xs" onClick={downloadQr}><DownloadSimple size={16} aria-hidden="true" /> {downloaded ? "Đã tải bản in" : "Tải QR bản in"}</button>
              </div>
              <Link href={`/quan-ly/${manageToken}`} className="btn-ghost w-full text-xs"><Sparkle size={15} className="text-[var(--gold)]" aria-hidden="true" /> Chỉnh sửa lời chúc</Link>
              <button className="btn-secondary w-full" type="button" onClick={() => { setForm(initialForm); setCode(""); setStep(1); }}>Tạo một lời chúc khác</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
