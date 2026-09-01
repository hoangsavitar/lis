import { redirect } from "next/navigation";

/** Compatibility route for QR files generated before the `/mo-qua` path fix. */
export default function LegacyReceivePage() {
  redirect("/mo-qua");
}
