"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, FloppyDisk, Key, Trash, WarningCircle } from "@phosphor-icons/react";
import { LisBrand } from "./lis-brand";

type Gift = {
  code: string;
  recipientName: string;
  senderName: string;
  hideSender: boolean;
  message: string;
  theme: string;
};

export function ManageFlow({ manageToken }: { manageToken: string }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [form, setForm] = useState({
    recipientName: "",
    senderName: "",
    hideSender: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/manage/${manageToken}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setGift(result.gift);
        setForm({
          recipientName: result.gift.recipientName,
          senderName: result.gift.senderName || "",
          hideSender: result.gift.hideSender,
          message: result.gift.message,
        });
      })
      .catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Không thể tải lời nhắn.")
      )
      .finally(() => setLoading(false));
  }, [manageToken]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const response = await fetch(`/api/manage/${manageToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setGift((current) => (current ? { ...current, ...form } : current));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2400);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu thay đổi.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Xóa lời nhắn này? Người nhận sẽ không thể mở bằng mã nữa.")) return;
    const response = await fetch(`/api/manage/${manageToken}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Không thể xóa lời nhắn lúc này.");
      return;
    }
    setDeleted(true);
  }

  if (loading) {
    return (
      <div className="section-shell py-24 text-center text-sm text-[var(--muted)]">
        Đang tải thông tin quản lý…
      </div>
    );
  }

  if (deleted) {
    return (
      <section className="section-shell py-20">
        <div className="paper-card mx-auto max-w-lg p-8 text-center space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
            <Trash size={24} aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
            Đã xóa lời nhắn
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Mã nhận sẽ không còn mở được nội dung này.
          </p>
          <Link href="/" className="btn-primary mt-4">
            <span>Về trang chủ</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  if (!gift) {
    return (
      <section className="section-shell py-20">
        <div className="paper-card mx-auto max-w-lg p-8 text-center space-y-4">
          <WarningCircle className="mx-auto text-[var(--rose)]" size={44} />
          <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
            Link không khả dụng
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {error || "Link quản lý không tồn tại hoặc đã hết hạn."}
          </p>
          <Link href="/" className="btn-ghost mt-4">
            Về trang chủ
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell max-w-xl py-12 md:py-20">
      <div className="mb-6 flex justify-between items-center">
        <LisBrand />
        <Link href="/" className="btn-ghost text-xs min-h-9 px-3">
          Về trang chủ
        </Link>
      </div>

      <div className="paper-card p-6 sm:p-9 space-y-6">
        <div>
          <p className="eyebrow flex items-center gap-1.5 mb-1">
            <Key size={14} />
            <span>Link quản lý riêng</span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            Chỉnh sửa lời nhắn
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[var(--muted)]">
            Đây là trang quản lý riêng của bạn để sửa hoặc cập nhật nội dung thư.
          </p>
        </div>

        <form onSubmit={save} className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-[rgba(235,243,241,0.85)] border border-[rgba(122,166,158,0.3)] px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--teal-dark)]">
              Mã nhận của bạn
            </span>
            <span className="font-sans text-xl font-bold tracking-[0.2em] text-[var(--teal-dark)] tabular-nums [font-variant-numeric:lining-nums_tabular-nums] leading-none">
              {gift.code}
            </span>
          </div>

          <div>
            <label className="field-label" htmlFor="manage-recipient">
              Tên người nhận <span className="text-[var(--rose)]">*</span>
            </label>
            <input
              id="manage-recipient"
              className="field-input"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="manage-sender">
              Tên người gửi
            </label>
            <input
              id="manage-sender"
              className="field-input"
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
            />
          </div>

          <label
            className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-[var(--muted)]"
            htmlFor="manage-hide"
          >
            <input
              id="manage-hide"
              className="size-4 rounded accent-[var(--rose)] cursor-pointer"
              type="checkbox"
              checked={form.hideSender}
              onChange={(e) => setForm({ ...form, hideSender: e.target.checked })}
            />
            <span>Ẩn tên người gửi</span>
          </label>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="field-label mb-0" htmlFor="manage-message">
                Lời nhắn <span className="text-[var(--rose)]">*</span>
              </label>
              <span className="text-xs text-[var(--muted)]">{form.message.length}/500</span>
            </div>
            <textarea
              id="manage-message"
              className="field-input field-textarea resize-y leading-relaxed"
              maxLength={500}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="btn-primary flex-1" type="submit" disabled={saving}>
              {saved ? <Check size={16} /> : <FloppyDisk size={16} />}
              <span>{saving ? "Đang lưu…" : saved ? "Đã lưu thành công" : "Lưu thay đổi"}</span>
            </button>
            <Link className="btn-teal flex-1" href="/open">
              <span>Xem trang mở quà</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="pt-2 text-center">
            <button
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors p-2 cursor-pointer"
              type="button"
              onClick={remove}
            >
              <Trash size={14} className="mr-1 inline" />
              Xóa lời nhắn này
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
