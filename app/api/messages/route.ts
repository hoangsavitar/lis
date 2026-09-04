import { NextResponse } from "next/server";
import { createGift } from "@/lib/gift-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipientName = typeof body.recipientName === "string" ? body.recipientName.trim().slice(0, 80) : "";
    const senderName = typeof body.senderName === "string" ? body.senderName.trim().slice(0, 80) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
    const theme = typeof body.theme === "string" ? body.theme : "botanical";
    const hideSender = Boolean(body.hideSender);

    if (!recipientName || !message) {
      return NextResponse.json({ error: "Tên người nhận và lời chúc là bắt buộc." }, { status: 400 });
    }

    const record = await createGift({ recipientName, senderName: senderName || undefined, hideSender, message, theme });
    return NextResponse.json({ code: record.code, manageToken: record.manageToken });
  } catch {
    return NextResponse.json({ error: "Dữ liệu chưa hợp lệ." }, { status: 400 });
  }
}
