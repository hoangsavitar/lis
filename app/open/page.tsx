import type { Metadata } from "next";
import { RecipientFlow } from "@/components/recipient-flow";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Open Your Letter | LIS BY LII",
  description: "Enter the 6-digit code from your card to open your letter.",
};

export default function ReceivePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content"><RecipientFlow /></main>
    </>
  );
}
