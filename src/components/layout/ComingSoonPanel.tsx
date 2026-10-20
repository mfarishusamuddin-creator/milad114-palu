interface ComingSoonPanelProps {
  title: string;
}

// Used by every admin panel route until its real content is built.
// Replace with the real page component once its detail is specified.
export function ComingSoonPanel({ title }: ComingSoonPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">{title}</p>
      <p className="text-sm text-muted-foreground">Panel ini belum dibangun.</p>
    </div>
  );
}
