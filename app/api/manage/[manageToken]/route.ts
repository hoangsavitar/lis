import { NextResponse } from "next/server";
import { getGiftStore, persistGiftStore } from "@/lib/gift-store";

type RouteContext = { params: Promise<{ manageToken: string }> };

function findGift(manageToken: string) {
  return [...getGiftStore().values()].find((gift) => gift.manageToken === manageToken);
}

export async function GET(_request: Request, context: RouteContext) {
  const { manageToken } = await context.params;
  const gift = findGift(manageToken);
  if (!gift) return NextResponse.json({ error: "Link quản lý không tồn tại hoặc đã hết hạn." }, { status: 404 });
  return NextResponse.json({ gift: { code: gift.code, recipientName: gift.recipientName, senderName: gift.senderName || "", hideSender: gift.hideSender, message: gift.message, theme: gift.theme } }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { manageToken } = await context.params;
  const gift = findGift(manageToken);
  if (!gift) return NextResponse.json({ error: "Link quản lý không tồn tại hoặc đã hết hạn." }, { status: 404 });
  try {
    const body = await request.json();
    const recipientName = typeof body.recipientName === "string" ? body.recipientName.trim().slice(0, 80) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
    if (!recipientName || !message) return NextResponse.json({ error: "Tên người nhận và lời chúc là bắt buộc." }, { status: 400 });
    gift.recipientName = recipientName;
    gift.senderName = typeof body.senderName === "string" ? body.senderName.trim().slice(0, 80) : "";
    gift.hideSender = Boolean(body.hideSender);
    gift.message = message;
    if (typeof body.theme === "string") gift.theme = body.theme;
    persistGiftStore();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Dữ liệu chưa hợp lệ." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { manageToken } = await context.params;
  const gifts = getGiftStore();
  const gift = findGift(manageToken);
  if (!gift) return NextResponse.json({ error: "Link quản lý không tồn tại hoặc đã hết hạn." }, { status: 404 });
  gifts.delete(gift.code);
  persistGiftStore();
  return NextResponse.json({ ok: true });
}
