import { HomePage } from "@/components/pages/HomePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("ar");

export default function Page() {
  return <HomePage lang="ar" />;
}
