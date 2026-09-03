"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Copy, DownloadSimple, Eye, Info, QrCode, Sparkle } from "@phosphor-icons/react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

type FormState = {
  recipientName: string;
  senderName: string;
  hideSender: boolean;
  message: string;
};

const initialForm: FormState = {
  recipientName: "",
  senderName: "",
  hideSender: false,
  message: "Cảm ơn em vì luôn là nguồn động lực và niềm vui mỗi ngày. Chúc em 20/10 thật nhiều hạnh phúc và bình an.",
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

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  function goPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.recipientName.trim() || !form.message.trim()) {
      setError("Vui lòng điền tên người nhận và nội dung lời nhắn.");
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
        body: JSON.stringify({ ...form, theme: "calla-lily" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể tạo lời chúc");
      setCode(result.code);
      setManageToken(result.manageToken);
      setStep(3);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Có lỗi xảy ra, vui lòng thử lại.");
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
    link.download = "lis-qr-mo-qua.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  }

  return (
    <section id="tao-loi-chuc" className="section-shell scroll-mt-24 py-12 md:py-20">
      <div className="mx-auto max-w-2xl">
        {/* Step Indicator Header — minimal like mockup */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rose-dark)] mb-3">
            {step === 1 && "1. Tạo lời nhắn"}
            {step === 2 && "2. Xem trước"}
            {step === 3 && "3. Tạo thành công"}
          </p>
          <ol className="create-stepper mx-auto max-w-xs list-none p-0">
            {[
              { number: 1, label: "Tạo" },
              { number: 2, label: "Xem trước" },
              { number: 3, label: "Xong" },
            ].map((item) => (
              <li
                key={item.number}
                aria-current={item.number === step ? "step" : undefined}
                className={`create-step ${item.number <= step ? "is-active" : ""}`}
              >
                <span className="create-step-number" aria-hidden="true">{item.number}</span>
                <span>{item.label}</span>
                {item.number < 3 && <span aria-hidden="true" className="mx-0.5 opacity-40">·</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* STEP 1: Form tạo lời nhắn */}
        {step === 1 && (
          <div className="paper-card relative overflow-hidden p-5 sm:p-8">
            {/* Floral illustration in corner — delicate */}
            <div className="pointer-events-none absolute -right-4 -top-2 w-24 sm:w-28 opacity-70" aria-hidden="true">
              <Image
                src="/images/calla-lily-single.jpg"
                alt=""
                width={120}
                height={120}
                className="rotate-12 rounded-full object-cover"
              />
            </div>

            <div className="mb-6">
              <h2 className="font-display italic text-2xl sm:text-3xl font-medium text-[var(--ink)]">
                Gửi một lời nhắn
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Viết lời nhắn của bạn và chúng tôi sẽ giữ bí mật đến người nhận.
              </p>
            </div>

            <form onSubmit={goPreview} className="space-y-4 sm:space-y-5">
              <div>
                <label className="field-label" htmlFor="recipientName">
                  Tên người nhận <span className="text-[var(--rose)]">*</span>
                </label>
                <input
                  className="field-input"
                  id="recipientName"
                  value={form.recipientName}
                  onChange={(event) => setField("recipientName", event.target.value)}
                  placeholder="Nhập tên người nhận"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="senderName">
                  Tên người gửi
                </label>
                <input
                  className="field-input"
                  id="senderName"
                  value={form.senderName}
                  onChange={(event) => setField("senderName", event.target.value)}
                  placeholder="Nhập tên người gửi"
                />
              </div>

              <label
                className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-[var(--muted)]"
                htmlFor="hideSender"
              >
                <input
                  className="size-4 rounded accent-[var(--rose)] cursor-pointer"
                  type="checkbox"
                  id="hideSender"
                  checked={form.hideSender}
                  onChange={(event) => setField("hideSender", event.target.checked)}
                />
                <span>Ẩn tên người gửi trong thư</span>
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="field-label mb-0" htmlFor="message">
                    Lời nhắn của bạn <span className="text-[var(--rose)]">*</span>
                  </label>
                  <span className="text-xs tabular-nums text-[var(--muted)]">
                    {form.message.length}/500
                  </span>
                </div>
                <textarea
                  className="field-input field-textarea resize-y leading-relaxed"
                  id="message"
                  maxLength={500}
                  value={form.message}
                  onChange={(event) => setField("message", event.target.value)}
                  placeholder="Viết lời nhắn của bạn ở đây..."
                  required
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button className="btn-primary w-full mt-2" type="submit">
                <span>Xem trước</span>
                <Eye size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Xem trước */}
        {step === 2 && (
          <div className="paper-card p-6 sm:p-9 space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
                Xem trước lời nhắn
              </h2>
              <p className="mt-1.5 text-sm text-[var(--muted)]">
                Kiểm tra lại nội dung trước khi xác nhận tạo mã.
              </p>
            </div>

            {/* Preview Card matching mockup */}
            <div className="glass-card-rose relative overflow-hidden p-6 sm:p-8 text-center">
              <div className="pointer-events-none absolute -right-4 -bottom-6 w-24 sm:w-32 opacity-85" aria-hidden="true">
                <Image
                  src="/images/calla-lily-single.jpg"
                  alt=""
                  width={140}
                  height={140}
                  className="-rotate-12 object-contain"
                />
              </div>

              {/* Text sits above the flower artwork */}
              <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rose)] mb-1">
                Gửi đến
              </p>
              <p className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] mb-5 break-words">
                {form.recipientName || "Người thương"}
              </p>

              <div className="mx-auto max-w-md rounded-2xl bg-white/75 p-5 text-left border border-[rgba(212,130,142,0.15)] shadow-xs">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--ink)]">
                  {form.message}
                </p>
              </div>

              <p className="mt-5 text-sm font-medium text-[var(--rose-dark)] break-words">
                Yêu thương, {form.hideSender ? "Một người thương bạn" : form.senderName || "LIS"}
              </p>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                className="btn-ghost flex-1"
                type="button"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Quay lại chỉnh sửa</span>
              </button>
              <button
                className="btn-primary flex-1"
                type="button"
                onClick={createMessage}
                disabled={isSaving}
              >
                <span>{isSaving ? "Đang tạo mã…" : "Xác nhận & tạo mã"}</span>
                {!isSaving && <ArrowUpRight size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Tạo thành công */}
        {step === 3 && (
          <div className="paper-card p-6 sm:p-9 space-y-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[rgba(212,130,142,0.15)] text-[var(--rose-dark)]">
              <Check size={28} weight="bold" aria-hidden="true" />
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
                Lời nhắn của bạn đã được tạo thành công!
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">
                Lưu mã truy cập này và gửi kèm thiệp cho người nhận.
              </p>
            </div>

            {/* Code display box */}
            <div className="glass-card-rose p-6 rounded-2xl max-w-sm mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)] mb-2">
                MÃ TRUY CẬP CỦA BẠN
              </p>
              <p className="my-2 font-sans text-4xl sm:text-5xl font-bold tracking-[0.25em] text-[var(--rose-dark)] select-all leading-none py-1 tabular-nums [font-variant-numeric:lining-nums_tabular-nums]">
                {code}
              </p>
              <button
                type="button"
                className="btn-ghost mt-3 text-xs min-h-9 px-4 rounded-full"
                onClick={copyCode}
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? "Đã sao chép mã" : "Sao chép mã"}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted)] max-w-sm mx-auto">
              <Info size={16} className="text-[var(--rose)] shrink-0" />
              <span>Mã này là duy nhất và chỉ người nhận mới mở được lời nhắn.</span>
            </div>

            {/* QR download card */}
            <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,253,249,0.7)] p-5 text-center max-w-sm mx-auto">
              <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] mb-3">
                <QrCode size={16} className="text-[var(--rose)]" />
                QR chung trên thiệp
              </p>
              <div className="mx-auto w-fit rounded-xl border border-[var(--line)] bg-white p-3 shadow-xs">
                <QRCodeSVG value={commonQrUrl} size={150} includeMargin level="H" />
                <div className="pointer-events-none absolute left-[-10000px] top-0 opacity-0" aria-hidden="true">
                  <QRCodeCanvas ref={qrCanvasRef} value={commonQrUrl} size={1024} includeMargin level="H" />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary mt-4 w-full text-xs min-h-9"
                onClick={downloadQr}
              >
                <DownloadSimple size={15} />
                <span>{downloaded ? "Đã tải bản in" : "Tải QR chung"}</span>
              </button>
            </div>

            <div className="space-y-2.5 pt-2 max-w-sm mx-auto">
              <Link href={`/mo-qua`} className="btn-teal w-full text-sm">
                <span>Xem thử lời nhắn</span>
                <ArrowUpRight size={16} />
              </Link>
              {manageToken && (
                <Link href={`/quan-ly/${manageToken}`} className="btn-ghost w-full text-xs">
                  <Sparkle size={14} className="text-[var(--gold)]" />
                  <span>Chỉnh sửa lời nhắn (Link quản lý bí mật)</span>
                </Link>
              )}
              <button
                className="btn-ghost w-full text-xs"
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setCode("");
                  setStep(1);
                }}
              >
                Tạo một lời nhắn khác
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
