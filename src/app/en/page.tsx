import { HomePage } from "@/components/pages/HomePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en");

export default function Page() {
  return <HomePage lang="en" />;
}
