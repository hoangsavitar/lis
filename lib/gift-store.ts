import { getCloudflareContext } from "@opennextjs/cloudflare";

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

type KVNamespaceLike = {
  get(key: string, type: "text"): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
};

declare global {
  // eslint-disable-next-line no-var
  var __loiGuiGifts: Map<string, GiftRecord> | undefined;
  // eslint-disable-next-line no-var
  var __loiGuiFileLoaded: boolean | undefined;
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

const giftKey = (code: string) => `gift:${code}`;
const manageKey = (token: string) => `manage:${token}`;

/** Cloudflare KV binding (production on Workers). Null locally or when unbound. */
function getKv(): KVNamespaceLike | null {
  try {
    const env = (getCloudflareContext().env ?? {}) as { GIFTS?: KVNamespaceLike };
    return env.GIFTS ?? null;
  } catch {
    return null;
  }
}

function isNodeRuntime() {
  return typeof process !== "undefined" && !!process.versions?.node;
}

function giftDataFile() {
  // Forward slashes work on Windows Node as well. Only used on Node, never on Workers.
  return `${process.cwd()}/data/gifts.json`;
}

/** In-memory Map: primary store locally, fallback when KV is unbound. */
function memoryStore(): Map<string, GiftRecord> {
  if (!globalThis.__loiGuiGifts) {
    globalThis.__loiGuiGifts = new Map<string, GiftRecord>([[demoGift.code, demoGift]]);
    globalThis.__loiGuiFileLoaded = false;
  }
  if (!globalThis.__loiGuiFileLoaded) {
    globalThis.__loiGuiFileLoaded = true;
    void loadFileIntoMemory();
  }
  return globalThis.__loiGuiGifts;
}

/** Best-effort file cache for local dev only. Never throws. */
async function loadFileIntoMemory() {
  try {
    if (!isNodeRuntime() || getKv()) return;
    const fs = await import("node:fs");
    if (!fs.existsSync(giftDataFile())) return;
    const saved = JSON.parse(fs.readFileSync(giftDataFile(), "utf8")) as GiftRecord[];
    const store = globalThis.__loiGuiGifts;
    if (!store) return;
    for (const gift of saved) {
      if (gift && typeof gift.code === "string" && gift.code.length === 6) store.set(gift.code, gift);
    }
  } catch {
    // Ephemeral runtimes (Workers) or read-only envs: memory only.
  }
}

async function persistFileBestEffort() {
  try {
    if (!isNodeRuntime() || getKv()) return;
    const fs = await import("node:fs");
    const file = giftDataFile();
    fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
    const records = [...memoryStore().values()].filter((gift) => gift.id !== demoGift.id);
    fs.writeFileSync(file, JSON.stringify(records, null, 2), "utf8");
  } catch {
    // Ignore: memory (or KV) remains the source of truth.
  }
}

export async function findGiftByCode(code: string): Promise<GiftRecord | null> {
  const kv = getKv();
  if (kv) {
    const raw = await kv.get(giftKey(code), "text");
    return raw ? (JSON.parse(raw) as GiftRecord) : null;
  }
  return memoryStore().get(code) ?? null;
}

export async function findGiftByManageToken(manageToken: string): Promise<GiftRecord | null> {
  const kv = getKv();
  if (kv) {
    const code = await kv.get(manageKey(manageToken), "text");
    if (!code) return null;
    return findGiftByCode(code);
  }
  for (const gift of memoryStore().values()) {
    if (gift.manageToken === manageToken) return gift;
  }
  return null;
}

export async function saveGift(gift: GiftRecord): Promise<void> {
  const kv = getKv();
  if (kv) {
    await kv.put(giftKey(gift.code), JSON.stringify(gift));
    await kv.put(manageKey(gift.manageToken), gift.code);
    return;
  }
  memoryStore().set(gift.code, gift);
  await persistFileBestEffort();
}

export async function deleteGiftByCode(code: string): Promise<void> {
  const kv = getKv();
  if (kv) {
    const existing = await findGiftByCode(code);
    await kv.delete(giftKey(code));
    if (existing) await kv.delete(manageKey(existing.manageToken));
    return;
  }
  memoryStore().delete(code);
  await persistFileBestEffort();
}

export async function createGift(
  input: Omit<GiftRecord, "id" | "code" | "manageToken" | "createdAt">
): Promise<GiftRecord> {
  const kv = getKv();
  const exists = kv
    ? async (code: string) => (await kv.get(giftKey(code), "text")) !== null
    : async (code: string) => memoryStore().has(code);
  let code = "";
  do {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    code = String(buf[0] % 1_000_000).padStart(6, "0");
    // eslint-disable-next-line no-await-in-loop
  } while (await exists(code));
  const gift: GiftRecord = {
    ...input,
    id: crypto.randomUUID(),
    code,
    manageToken: crypto.randomUUID().replaceAll("-", ""),
    createdAt: new Date().toISOString(),
  };
  await saveGift(gift);
  return gift;
}
