import { SwarmCursor } from "./SwarmCursor";
import { useSettings } from "@/features/settings/hooks/useSettings";
import type { SwarmCursorSettings } from "@/features/settings/types";

export function SwarmCursorFromSettings() {
  const { data: settings, isLoading } = useSettings();

  // Don't mount SwarmCursor until settings has actually resolved — otherwise
  // it briefly renders with its own built-in defaults first, then jumps to
  // the saved config once the query lands (visible as a flash/size change).
  if (isLoading) return null;

  const cfg = settings?.swarm_cursor as SwarmCursorSettings | undefined;

  return (
    <SwarmCursor
      color={cfg?.color}
      accentColor={cfg?.accentColor}
      colorMode={cfg?.colorMode}
      count={cfg?.count}
      size={cfg?.size}
      speed={cfg?.speed}
      wander={cfg?.wander}
      trail={cfg?.trail}
      scatterOnClick={cfg?.scatterOnClick}
      enabled={cfg?.enabled}
    />
  );
}
