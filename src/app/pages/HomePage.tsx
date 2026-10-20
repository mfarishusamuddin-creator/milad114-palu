import { LandingPage } from "./LandingPage";

// "/" kini statis-minimal: CMS/konten publik sudah dihapus dari frontend,
// sehingga tidak ada lagi query content_pages/pages (structured maupun legacy).
// HomePage cukup meneruskan ke LandingPage (hero 301) tanpa cek data apa pun.
export function HomePage() {
  return <LandingPage />;
}
