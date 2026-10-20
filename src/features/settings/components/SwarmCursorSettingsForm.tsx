import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertSetting } from "../api/settings.api";
import { useSettings } from "../hooks/useSettings";
import type { SwarmCursorSettings } from "../types";

const schema = z.object({
  color: z.string().min(1),
  accentColor: z.string().min(1),
  colorMode: z.enum(["solid", "rainbow"]),
  count: z.coerce.number().min(1).max(60),
  size: z.coerce.number().min(1).max(20),
  speed: z.coerce.number().min(0.1).max(10),
  wander: z.coerce.number().min(0).max(1),
  trail: z.coerce.number().min(0).max(1),
});
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function SwarmCursorSettingsForm() {
  const { data: settings } = useSettings();
  const queryClient = useQueryClient();
  const current = settings?.swarm_cursor as SwarmCursorSettings | undefined;

  const { register, control, handleSubmit } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    values: current
      ? {
          color: current.color,
          accentColor: current.accentColor,
          colorMode: current.colorMode,
          count: current.count,
          size: current.size,
          speed: current.speed,
          wander: current.wander,
          trail: current.trail,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: FormOutput) => upsertSetting("swarm_cursor", { ...current, ...values }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-color">Warna</Label>
          <Input id="sc-color" type="color" className="h-11 p-1" {...register("color")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-accent">Warna Aksen</Label>
          <Input id="sc-accent" type="color" className="h-11 p-1" {...register("accentColor")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sc-mode">Mode Warna</Label>
        <Controller
          name="colorMode"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="sc-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="rainbow">Warna-warni</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-count">Jumlah Partikel</Label>
          <Input id="sc-count" type="number" step={1} {...register("count")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-size">Ukuran</Label>
          <Input id="sc-size" type="number" step={0.5} {...register("size")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-speed">Kecepatan</Label>
          <input id="sc-speed" type="range" min={0.1} max={10} step={0.1} {...register("speed")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-wander">Wander</Label>
          <input id="sc-wander" type="range" min={0} max={1} step={0.05} {...register("wander")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sc-trail">Trail</Label>
          <input id="sc-trail" type="range" min={0} max={1} step={0.05} {...register("trail")} />
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-fit">
        {mutation.isPending ? "Menyimpan…" : "Simpan"}
      </Button>
      {mutation.isSuccess && <p className="text-xs text-emerald-400">Tersimpan.</p>}
    </form>
  );
}
