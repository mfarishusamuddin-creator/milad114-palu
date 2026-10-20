import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCode2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "../../auth/hooks/useSession";
import { createPage, deletePage, updatePage } from "../api/pages.api";
import { pageSchema, type PageFormValues } from "../schemas";
import type { PageRow, PageScope } from "../types";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ResizableHtmlToolFrame } from "./ResizableHtmlToolFrame";

const SCOPE_LABELS: Record<PageScope, string> = {
  admin: "Admin (privat)",
  public: "Publik",
};

function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message;
  }
  if (typeof e === "string" && e.trim()) return e;
  return fallback;
}

interface PageEditorProps {
  /** Page yang sedang diedit; null = buat baru. */
  page: PageRow | null;
  /** Scope default untuk page baru (admin/public). */
  defaultScope: PageScope;
  /** Kunci invalidasi setelah simpan/hapus. */
  onSaved?: () => void;
  /** Tampilkan kontrol scope. Untuk CMS publik bisa disembunyikan (tetap 'public'). */
  showScope?: boolean;
}

/**
 * Editor reusable untuk satu halaman/tool: form (judul, slug, scope, published,
 * urutan, is_home, konten HTML) + pratinjau + simpan/hapus.
 */
export function PageEditor({ page, defaultScope, onSaved, showScope = true }: PageEditorProps) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(page?.html_content ?? null);
  // Penghapusan page digate modal konfirmasi password superadmin (re-auth), bukan
  // langsung dieksekusi, agar tindakan fatal ini tidak terjadi tanpa pencegahan.
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  // Email sesi utama — dipakai HANYA untuk re-auth di modal, bukan untuk operasi lain.
  const { session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      scope: page?.scope ?? defaultScope,
      is_published: page?.is_published ?? false,
      sort_order: page?.sort_order ?? 0,
      is_home: page?.is_home ?? false,
      html_content: page?.html_content ?? "",
    },
  });

  const scope = watch("scope") ?? defaultScope;
  const isPublished = watch("is_published") ?? false;
  const isHome = watch("is_home") ?? false;

  // Sinkron preview saat konten HTML berubah (sederhana, tanpa debounce).
  const htmlValue = watch("html_content");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["pages"] });
    queryClient.invalidateQueries({ queryKey: ["public-pages"] });
    queryClient.invalidateQueries({ queryKey: ["home-page"] });
  };

  const saveMutation = useMutation({
    mutationFn: (v: PageFormValues) => {
      const input = {
        slug: v.slug,
        title: v.title,
        html_content: v.html_content,
        scope: v.scope,
        is_published: v.is_published,
        sort_order: Math.max(0, Math.floor(Number(v.sort_order) || 0)),
        is_home: v.is_home,
      };
      return page ? updatePage(page.id, input) : createPage(input);
    },
    onSuccess: () => {
      invalidate();
      onSaved?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!page) throw new Error("Tidak ada halaman untuk dihapus.");
      return deletePage(page.id);
    },
    onSuccess: () => {
      invalidate();
      onSaved?.();
      // Tutup modal konfirmasi setelah penghapusan benar-benar berhasil.
      setConfirmDeleteOpen(false);
    },
  });

  function onSubmit(v: PageFormValues) {
    saveMutation.mutate(v);
  }

  return (
    <form className="flex max-w-2xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="page-title">Judul</Label>
          <Input id="page-title" placeholder="mis. VaultDesk" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="page-slug">Slug</Label>
          <Input id="page-slug" placeholder="mis. vaultdesk" {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {showScope && (
          <div className="flex flex-col gap-1.5">
            <Label>Scope</Label>
            <Select value={scope} onValueChange={(v) => setValue("scope", v as PageScope, { shouldValidate: true })}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{SCOPE_LABELS.admin}</SelectItem>
                <SelectItem value="public">{SCOPE_LABELS.public}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="page-order">Urutan (sort_order)</Label>
          <Input id="page-order" type="number" min={0} className="w-24" {...register("sort_order", { valueAsNumber: true })} />
          {errors.sort_order && <p className="text-xs text-destructive">{errors.sort_order.message}</p>}
        </div>

        <div className="flex items-end gap-3 pb-3 text-sm text-foreground">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setValue("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-foreground"
            />
            Published
          </label>
          {scope === "public" && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isHome}
                onChange={(e) => setValue("is_home", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground"
              />
              Jadikan halaman utama
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="page-html">Konten HTML</Label>
        <Textarea
          id="page-html"
          rows={18}
          spellCheck={false}
          placeholder="Tempel seluruh isi file HTML di sini… (untuk portfolio/media, gunakan tautan/embed eksternal, bukan upload besar ke Storage)"
          className="font-mono text-xs"
          {...register("html_content", {
            onChange: (e) => setPreview(e.target.value),
          })}
        />
        {errors.html_content && <p className="text-xs text-destructive">{errors.html_content.message}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Menyimpan…" : "Simpan"}
        </Button>
        {page && (
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Trash2 size={14} /> Hapus
          </Button>
        )}
      </div>

      {saveMutation.isError && (
        <p className="text-xs text-destructive">{errorMessage(saveMutation.error, "Gagal menyimpan.")}</p>
      )}
      {deleteMutation.isError && (
        <p className="text-xs text-destructive">{errorMessage(deleteMutation.error, "Gagal menghapus.")}</p>
      )}
      {saveMutation.isSuccess && <p className="text-xs text-emerald-400">Tersimpan.</p>}
      {deleteMutation.isSuccess && <p className="text-xs text-emerald-400">Dihapus.</p>}

      {preview && (
        <div className="mt-2 border-t border-border pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <FileCode2 size={12} className="mr-1 inline" />
            Pratinjau
          </p>
          <ResizableHtmlToolFrame
            html={htmlValue}
            title={watch("title") || "Pratinjau"}
            slug={`preview-${page?.slug ?? "new"}`}
          />
        </div>
      )}

      {confirmDeleteOpen && (
        <DeleteConfirmDialog
          page={page}
          sessionEmail={session?.user.email ?? null}
          deleting={deleteMutation.isPending}
          onCancel={() => setConfirmDeleteOpen(false)}
          onConfirm={() => deleteMutation.mutateAsync()}
        />
      )}
    </form>
  );
}
