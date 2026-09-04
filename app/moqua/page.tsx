import { redirect } from "next/navigation";

/** Compatibility route for QR files generated before the `/open` path. */
export default function LegacyReceivePage() {
  redirect("/open");
}
