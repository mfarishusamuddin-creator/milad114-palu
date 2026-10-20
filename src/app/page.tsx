import { HomePage } from "@/components/pages/HomePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("id");

export default function Page() {
  return <HomePage lang="id" />;
}
