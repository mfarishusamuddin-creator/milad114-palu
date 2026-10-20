import { useEffect } from "react";

import { useSettings } from "@/features/settings/hooks/useSettings";
import type { SiteMetaSettings } from "@/features/settings/types";

export function DocumentTitleSync() {
  const { data: settings } = useSettings();

  useEffect(() => {
    const meta = settings?.site_meta as SiteMetaSettings | undefined;
    if (meta?.title) document.title = meta.title;
  }, [settings]);

  return null;
}
