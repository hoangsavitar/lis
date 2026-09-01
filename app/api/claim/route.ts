import { NextResponse } from "next/server";
import { getGiftStore } from "@/lib/gift-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 6) : "";
    const gift = getGiftStore().get(code);
    if (!gift || code.length !== 6) {
      return NextResponse.json({ error: "Mã chưa đúng hoặc lời chúc đã hết hạn." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ gift: { recipientName: gift.recipientName, senderName: gift.senderName, hideSender: gift.hideSender, message: gift.message, theme: gift.theme } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Mã chưa đúng hoặc lời chúc đã hết hạn." }, { status: 400 });
  }
}
