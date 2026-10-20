import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useSettings } from "../hooks/useSettings";
import { upsertSetting } from "../api/settings.api";
import type { SubmarineSettings } from "../types";
import { DEFAULT_SUBMARINE } from "../lib/submarine";

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Gagal menyimpan.";
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "%",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-foreground"
      />
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">{title}</p>
      {children}
    </div>
  );
}

export function SubmarineSettingsForm() {
  const queryClient = useQueryClient();
  const { data: settings } = useSettings();
  const stored = (settings?.submarine as Partial<SubmarineSettings> | undefined) ?? {};

  const [cfg, setCfg] = useState<SubmarineSettings>({ ...DEFAULT_SUBMARINE, ...stored });

  const saveMutation = useMutation({
    mutationFn: () => upsertSetting("submarine", cfg),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  function set<K extends keyof SubmarineSettings>(k: K, v: SubmarineSettings[K]) {
    setCfg((c) => ({ ...c, [k]: v }));
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <p className="text-xs text-muted-foreground">
        Kendalikan perilaku kapal selam & pencahayaan. Perubahan disimpan di Supabase (tabel{" "}
        <code>settings</code>, key <code>submarine</code>) dan langsung diterapkan — tidak perlu ubah kode.
      </p>

      <label className="flex w-fit items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={cfg.enabled}
          onChange={(e) => set("enabled", e.target.checked)}
          className="h-4 w-4 accent-foreground"
        />
        Aktifkan efek kapal selam
      </label>

      <Group title="Submarine">
        <RangeField label="Sensitivitas" value={cfg.sensitivity} min={0} max={200} onChange={(v) => set("sensitivity", v)} />
        <RangeField label="Kelembutan Gerak" value={cfg.movementSmoothness} min={0} max={100} onChange={(v) => set("movementSmoothness", v)} />
        <RangeField label="Kelembutan Rotasi" value={cfg.rotationSmoothness} min={0} max={100} onChange={(v) => set("rotationSmoothness", v)} />
      </Group>

      <Group title="Flashlight">
        <RangeField label="Intensitas Cahaya" value={cfg.lightIntensity} min={0} max={200} onChange={(v) => set("lightIntensity", v)} />
        <RangeField label="Jangkauan Beam" value={cfg.lightRange} min={0} max={300} onChange={(v) => set("lightRange", v)} />
        <RangeField label="Lebar / Spread Beam" value={cfg.beamSpread} min={0} max={300} onChange={(v) => set("beamSpread", v)} />
        <RangeField label="Kelembutan Tepi" value={cfg.beamSoftness} min={0} max={100} onChange={(v) => set("beamSoftness", v)} />
        <RangeField label="Glow Sumber Cahaya" value={cfg.glow} min={0} max={200} onChange={(v) => set("glow", v)} />
        <RangeField label="Visibilitas (di luar beam)" value={cfg.illumination} min={0} max={100} onChange={(v) => set("illumination", v)} />
      </Group>

      <div className="flex items-center gap-3">
        <Button type="button" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
          {saveMutation.isPending ? "Menyimpan…" : "Simpan Pengaturan"}
        </Button>
        {saveMutation.isSuccess && <span className="text-xs text-emerald-400">Tersimpan.</span>}
      </div>
      {saveMutation.isError && <p className="text-xs text-destructive">{errMsg(saveMutation.error)}</p>}
    </div>
  );
}
