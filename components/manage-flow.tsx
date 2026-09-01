"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, FloppyDisk, FlowerLotus, Key, Trash, WarningCircle } from "@phosphor-icons/react";

type Gift = { code: string; recipientName: string; senderName: string; hideSender: boolean; message: string; theme: string };

export function ManageFlow({ manageToken }: { manageToken: string }) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [form, setForm] = useState({ recipientName: "", senderName: "", hideSender: false, message: "" });
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
        setForm({ recipientName: result.gift.recipientName, senderName: result.gift.senderName, hideSender: result.gift.hideSender, message: result.gift.message });
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải lời chúc."))
      .finally(() => setLoading(false));
  }, [manageToken]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setSaved(false); setError("");
    try {
      const response = await fetch(`/api/manage/${manageToken}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setGift((current) => current ? { ...current, ...form } : current);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2400);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu thay đổi.");
    } finally { setSaving(false); }
  }

  async function remove() {
    if (!window.confirm("Xóa lời chúc này? Người nhận sẽ không thể mở bằng mã nữa.")) return;
    const response = await fetch(`/api/manage/${manageToken}`, { method: "DELETE" });
    if (!response.ok) { setError("Không thể xóa lời chúc lúc này."); return; }
    setDeleted(true);
  }

  if (loading) return <div className="section-shell py-20 text-center text-sm text-[var(--muted)]">Đang tải link quản lý…</div>;
  if (deleted) return <section className="section-shell py-20"><div className="paper-card mx-auto max-w-lg p-8 text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[rgba(234,200,203,0.34)] text-[var(--rose)]"><Trash size={23} aria-hidden="true" /></div><h1 className="font-display mt-5 text-4xl">Đã xóa lời chúc</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Mã nhận sẽ không còn mở được nội dung này.</p><Link href="/" className="btn-primary mt-7">Về trang chủ <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>;
  if (!gift) return <section className="section-shell py-20"><div className="paper-card mx-auto max-w-lg p-8 text-center"><WarningCircle className="mx-auto text-[var(--rose)]" size={42} /><h1 className="font-display mt-5 text-4xl">Link không khả dụng</h1><p className="mt-3 text-sm text-[var(--muted)]">{error || "Link quản lý không tồn tại hoặc đã hết hạn."}</p><Link href="/" className="btn-ghost mt-7">Về trang chủ</Link></div></section>;

  return <section className="section-shell py-10 md:py-16"><div className="mx-auto max-w-2xl"><div className="mb-8"><p className="eyebrow flex items-center gap-2"><Key size={15} aria-hidden="true" /> Link quản lý riêng</p><h1 className="font-display mt-3 text-4xl text-[var(--ink)] md:text-5xl">Chỉnh lại lời chúc</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">Lưu link này ở nơi an toàn. Đây là chìa khóa duy nhất để sửa hoặc xóa món quà.</p></div><form onSubmit={save} className="paper-card space-y-5 p-6 md:p-8"><div className="flex items-center justify-between rounded-xl bg-[rgba(214,230,223,0.48)] px-4 py-3"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--teal)]">Mã nhận</span><span className="font-mono text-xl font-semibold tracking-[0.16em] text-[var(--teal)]">{gift.code}</span></div><div><label className="field-label" htmlFor="manage-recipient">Tên người nhận</label><input id="manage-recipient" className="field-input" value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} required /></div><div><label className="field-label" htmlFor="manage-sender">Tên người gửi</label><input id="manage-sender" className="field-input" value={form.senderName} onChange={(event) => setForm({ ...form, senderName: event.target.value })} /></div><label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[var(--muted)]" htmlFor="manage-hide"><input id="manage-hide" className="size-4 accent-[var(--rose)]" type="checkbox" checked={form.hideSender} onChange={(event) => setForm({ ...form, hideSender: event.target.checked })} /> Ẩn tên người gửi</label><div><div className="mb-2 flex items-center justify-between"><label className="field-label mb-0" htmlFor="manage-message">Lời chúc</label><span className="text-xs text-[var(--muted)]">{form.message.length}/500</span></div><textarea id="manage-message" className="field-input min-h-40 resize-y leading-6" maxLength={500} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required /></div>{error && <p className="flex items-center gap-2 rounded-xl border border-[rgba(155,75,91,0.22)] bg-[rgba(234,200,203,0.2)] px-3 py-2 text-sm text-[var(--rose)]" role="alert"><WarningCircle size={16} aria-hidden="true" /> {error}</p>}<div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary flex-1" type="submit" disabled={saving}>{saved ? <Check size={17} aria-hidden="true" /> : <FloppyDisk size={17} aria-hidden="true" />} {saving ? "Đang lưu…" : saved ? "Đã lưu" : "Lưu thay đổi"}</button><Link className="btn-ghost flex-1" href="/mo-qua"><FlowerLotus size={17} aria-hidden="true" /> Xem lời chúc</Link></div><button className="w-full rounded-full px-4 py-3 text-sm font-semibold text-[var(--rose)] transition-colors hover:bg-[rgba(234,200,203,0.2)]" type="button" onClick={remove}><Trash size={16} className="mr-2 inline" aria-hidden="true" /> Xóa lời chúc</button></form></div></section>;
}
