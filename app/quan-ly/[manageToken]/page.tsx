import { SiteHeader } from "@/components/site-header";
import { ManageFlow } from "@/components/manage-flow";

export const dynamic = "force-dynamic";

export default async function ManagePage({ params }: { params: Promise<{ manageToken: string }> }) {
  const { manageToken } = await params;
  return <><SiteHeader /><main id="main-content"><ManageFlow manageToken={manageToken} /></main></>;
}
