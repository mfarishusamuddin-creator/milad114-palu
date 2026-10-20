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
import type { NavLayoutSettings, SiteMetaSettings } from "../types";

const schema = z.object({
  title: z.string().min(1),
  sidePosition: z.enum(["left", "right"]),
});
type FormValues = z.infer<typeof schema>;

export function SiteLayoutSettingsForm() {
  const { data: settings } = useSettings();
  const queryClient = useQueryClient();
  const meta = settings?.site_meta as SiteMetaSettings | undefined;
  const nav = settings?.nav_layout as NavLayoutSettings | undefined;

  const { register, control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: meta && nav ? { title: meta.title, sidePosition: nav.sidePosition } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await upsertSetting("site_meta", { title: values.title });
      await upsertSetting("nav_layout", { sidePosition: values.sidePosition });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  return (
    <form className="flex max-w-sm flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="site-title">Nama Web</Label>
        <Input id="site-title" {...register("title")} />
        <p className="text-xs text-muted-foreground">
          Favicon masih manual — ganti file <code>public/favicon.svg</code> di kode.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nav-side">Posisi Side-nav Panel</Label>
        <Controller
          name="sidePosition"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="nav-side">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Kiri</SelectItem>
                <SelectItem value="right">Kanan</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-xs text-muted-foreground">Dipakai semua panel — persiapan opsi bahasa (RTL) nanti.</p>
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-fit">
        {mutation.isPending ? "Menyimpan…" : "Simpan"}
      </Button>
      {mutation.isSuccess && <p className="text-xs text-emerald-400">Tersimpan.</p>}
    </form>
  );
}
