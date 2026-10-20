import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "../hooks/useSettings";
import { upsertSetting } from "../api/settings.api";
import type { ColorMode, ThemeSettings } from "../types";
import { DEFAULT_THEME } from "../lib/theme";

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Gagal menyimpan tema.";
}

function ModeToggle({ value, onChange }: { value: ColorMode; onChange: (m: ColorMode) => void }) {
  return (
    <div className="flex w-fit overflow-hidden rounded-lg border border-border">
      {(["light", "dark"] as ColorMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={
            value === m
              ? "bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              : "bg-input px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          }
        >
          {m === "light" ? "Terang" : "Gelap"}
        </button>
      ))}
    </div>
  );
}

function ScopeEditor({
  title,
  scope,
  onChange,
}: {
  title: string;
  scope: ThemeSettings["public"];
  onChange: (s: ThemeSettings["public"]) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">{title}</p>
      <div className="flex flex-col gap-1.5">
        <Label>Mode</Label>
        <ModeToggle value={scope.mode} onChange={(mode) => onChange({ ...scope, mode })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Warna Aksen</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={scope.accent}
            onChange={(e) => onChange({ ...scope, accent: e.target.value })}
            className="h-9 w-14 cursor-pointer rounded border border-border bg-transparent"
          />
          <Input
            value={scope.accent}
            onChange={(e) => onChange({ ...scope, accent: e.target.value })}
            className="w-28 font-mono text-xs"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Border radius (px)</Label>
        <Input
          type="number"
          min={0}
          value={scope.radius}
          onChange={(e) => onChange({ ...scope, radius: Number(e.target.value) || 0 })}
          className="w-24"
        />
      </div>
    </div>
  );
}

export function ThemeSettingsForm() {
  const queryClient = useQueryClient();
  const { data: settings } = useSettings();
  const stored = (settings?.theme as Partial<ThemeSettings> | undefined) ?? {};

  const [theme, setTheme] = useState<ThemeSettings>({
    public: { ...DEFAULT_THEME.public, ...(stored.public ?? {}) },
    admin: { ...DEFAULT_THEME.admin, ...(stored.admin ?? {}) },
    font: stored.font ?? DEFAULT_THEME.font,
  });

  const saveMutation = useMutation({
    mutationFn: () => upsertSetting("theme", theme),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <p className="text-xs text-muted-foreground">
        Tema publik & dashboard admin dapat diatur terpisah dan langsung tercermin. Warna aksen mengubah
        aksen/glow; mode menentukan terang/gelap. Perubahan tersimpan di tabel <code>settings</code> dan bisa
        diubah lagi via kode (lihat <code>features/settings/lib/theme.ts</code>).
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScopeEditor title="Tema Publik" scope={theme.public} onChange={(s) => setTheme({ ...theme, public: s })} />
        <ScopeEditor title="Tema Dashboard Admin" scope={theme.admin} onChange={(s) => setTheme({ ...theme, admin: s })} />
      </div>

      <div className="flex max-w-xs flex-col gap-1.5">
        <Label htmlFor="theme-font">Font (nama keluarga)</Label>
        <Input id="theme-font" value={theme.font} onChange={(e) => setTheme({ ...theme, font: e.target.value })} placeholder="Inter" />
        <p className="text-xs text-muted-foreground">mis. Inter, system-ui, sans-serif, serif, monospace</p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
          {saveMutation.isPending ? "Menyimpan…" : "Simpan Tema"}
        </Button>
        {saveMutation.isSuccess && <span className="text-xs text-emerald-400">Tersimpan.</span>}
      </div>

      {saveMutation.isError && (
        <p className="text-xs text-destructive">{errorMessage(saveMutation.error)}</p>
      )}
    </div>
  );
}
