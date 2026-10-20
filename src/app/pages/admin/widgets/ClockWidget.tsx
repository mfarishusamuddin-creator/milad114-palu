import { useEffect, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Jam</p>
      <p className="mt-1 font-mono text-3xl text-foreground">{now.toLocaleTimeString("id-ID")}</p>
      <p className="text-sm text-muted-foreground">
        {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
