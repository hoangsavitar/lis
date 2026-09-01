import { randomInt, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type GiftRecord = {
  id: string;
  code: string;
  manageToken: string;
  recipientName: string;
  senderName?: string;
  hideSender: boolean;
  message: string;
  theme: string;
  createdAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __loiGuiGifts: Map<string, GiftRecord> | undefined;
}

const demoGift: GiftRecord = {
  id: "demo-gift",
  code: "582913",
  manageToken: "demo-manage-token",
  recipientName: "Minh Anh",
  senderName: "A.",
  hideSender: false,
  message: "Cảm ơn em vì luôn là nguồn động lực và niềm vui mỗi ngày. Chúc em 20/10 thật nhiều hạnh phúc và bình an.",
  theme: "calla-lily",
  createdAt: new Date().toISOString(),
};

const giftDataDirectory = path.join(process.cwd(), "data");
const giftDataFile = path.join(giftDataDirectory, "gifts.json");

function loadGiftStore() {
  const gifts = new Map<string, GiftRecord>([[demoGift.code, demoGift]]);
  if (!existsSync(giftDataFile)) return gifts;

  try {
    const saved = JSON.parse(readFileSync(giftDataFile, "utf8")) as GiftRecord[];
    for (const gift of saved) {
      if (gift && typeof gift.code === "string" && gift.code.length === 6) gifts.set(gift.code, gift);
    }
  } catch {
    // Keep the demo available if a manually edited data file is invalid.
  }
  return gifts;
}

export function persistGiftStore() {
  const gifts = getGiftStore();
  mkdirSync(giftDataDirectory, { recursive: true });
  const records = [...gifts.values()].filter((gift) => gift.id !== demoGift.id);
  writeFileSync(giftDataFile, JSON.stringify(records, null, 2), "utf8");
}

export function getGiftStore() {
  if (!globalThis.__loiGuiGifts) {
    globalThis.__loiGuiGifts = loadGiftStore();
  }
  return globalThis.__loiGuiGifts;
}

export function createGift(input: Omit<GiftRecord, "id" | "code" | "manageToken" | "createdAt">) {
  const gifts = getGiftStore();
  let code = "";
  do {
    code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  } while (gifts.has(code));
  const gift: GiftRecord = { ...input, id: randomUUID(), code, manageToken: randomUUID().replaceAll("-", ""), createdAt: new Date().toISOString() };
  gifts.set(code, gift);
  persistGiftStore();
  return gift;
}
