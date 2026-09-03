import { RecipientFlow } from "@/components/recipient-flow";
import { SiteHeader } from "@/components/site-header";

export default function ReceivePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content"><RecipientFlow /></main>
    </>
  );
}
