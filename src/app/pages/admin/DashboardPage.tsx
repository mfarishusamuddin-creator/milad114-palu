import { ClockWidget } from "./widgets/ClockWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { WorldMapWidget } from "./widgets/WorldMapWidget";
import { QuickToolsWidget } from "./widgets/QuickToolsWidget";
import { SystemHealthWidget } from "./widgets/SystemHealthWidget";
import { TodayWidget } from "./widgets/TodayWidget";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">Dashboard Utama</p>
        <h1 className="mt-1 text-xl font-semibold text-foreground">Ringkasan</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Pusat komando read-only — apa yang perlu diperhatikan pengguna, dari semua tool yang terhubung.
        </p>
      </div>

      {/* TodayWidget span penuh di baris pertama; empat widget lain mengisi baris berikutnya. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TodayWidget />
        <ClockWidget />
        <CalendarWidget />
        <QuickToolsWidget />
        <SystemHealthWidget />
      </div>

      <WorldMapWidget />
    </div>
  );
}
