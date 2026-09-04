import { redirect } from "next/navigation";

/** Legacy slug: old QR codes and links point here. */
export default function LegacyOpenPage() {
  redirect("/open");
}
