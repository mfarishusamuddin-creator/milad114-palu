import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PageRow } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

/** Ambil pesan error yang aman ditampilkan ke pengguna (tanpa membocorkan detail teknis). */
function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message;
  }
  if (typeof e === "string" && e.trim()) return e;
  return fallback;
}

interface DeleteConfirmDialogProps {
  /** Page yang akan dihapus (untuk menampilkan judul + slug secara eksplisit). */
  page: PageRow | null;
  /** Email sesi utama pengguna; dipakai HANYA untuk re-auth. null = verifikasi mustahil. */
  sessionEmail: string | null;
  /** Status penghapusan sedang berjalan (dari mutation di PageEditor). */
  deleting: boolean;
  /** Tutup modal tanpa menghapus. */
  onCancel: () => void;
  /** Dijalankan SETELAH password terverifikasi: melakukan penghapusan sesungguhnya. */
  onConfirm: () => Promise<void>;
}

/**
 * Modal konfirmasi re-auth untuk menghapus page/tool.
 *
 * Penghapusan lewat Kelola Tools sebelumnya terjadi tanpa pencegahan apa pun,
 * sehingga modal ini meng-gate tindakan fatal tersebut dengan verifikasi ulang
 * password superadmin. Verifikasi memakai TRANSIENT Supabase client agar sesi
 * utama pengguna tidak tersentuh sama sekali.
 *
 * Komponen ini hanya di-mount saat modal perlu tampil (parent me-render-nya
 * secara kondisional). Begitu ditutup, komponen unmount sehingga seluruh state
 * — termasuk password — otomatis musnah dari memori React.
 */
export function DeleteConfirmDialog({
  page,
  sessionEmail,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const busy = verifying || deleting;

  async function handleConfirm() {
    setError(null);

    // Edge: tanpa email sesi, verifikasi password tidak mungkin dilakukan.
    if (!sessionEmail) {
      setError("Sesi pengguna tidak tersedia. Silakan masuk ulang lalu coba lagi.");
      return;
    }
    if (!password) {
      setError("Masukkan password superadmin untuk melanjutkan.");
      return;
    }

    setVerifying(true);
    try {
      // TRANSIENT client: persistSession=false & autoRefreshToken=false memastikan
      // re-auth ini TIDAK menyentuh sesi utama pengguna — token aktif tidak ditimpa,
      // tidak ada refresh sesi, dan tidak ada yang ditulis ke storage. Password hanya
      // hidup di client sementara ini, tidak pernah masuk state global maupun log.
      const transient = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: signInError } = await transient.auth.signInWithPassword({
        email: sessionEmail,
        password,
      });
      if (signInError) {
        setError("Password salah atau verifikasi gagal. Penghapusan dibatalkan.");
        setPassword("");
        return;
      }
    } catch (e) {
      setError(errorMessage(e, "Verifikasi gagal. Penghapusan dibatalkan."));
      setPassword("");
      return;
    } finally {
      setVerifying(false);
    }

    // Verifikasi lolos → hapus password dari state lalu jalankan penghapusan sesungguhnya.
    setPassword("");
    try {
      await onConfirm();
      // Sukses: parent menutup modal (unmount) lewat onSuccess mutation.
    } catch (e) {
      // Penghapusan gagal → tetap buka modal dan tampilkan alasannya.
      setError(errorMessage(e, "Gagal menghapus halaman."));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start gap-2">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-destructive" />
          <div className="flex flex-col gap-1">
            <h2 id="delete-confirm-title" className="text-sm font-semibold text-foreground">
              Hapus halaman ini?
            </h2>
            <p className="text-xs text-muted-foreground">
              <span className="font-mono text-foreground">{page?.slug ?? "—"}</span>
              {page?.title ? ` · ${page.title}` : ""}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          <p>
            Penghapusan akan membuang halaman ini (HTML + metadata) dari tabel{" "}
            <span className="font-mono text-foreground">pages</span>.
          </p>
          <p>
            Data tool di tabel <span className="font-mono text-foreground">records</span> tidak ikut
            terhapus dan dapat dipulihkan bila tool didaftarkan ulang dengan slug yang sama.
          </p>
          <p className="text-destructive">
            Tindakan ini fatal untuk kustomisasi HTML yang belum di-backup.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <Label htmlFor="delete-confirm-password">Password superadmin</Label>
          <Input
            id="delete-confirm-password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            disabled={busy}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !busy) {
                e.preventDefault();
                void handleConfirm();
              }
            }}
          />
        </div>

        {error && <p className="mb-3 text-xs text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>
            Batal
          </Button>
          <Button type="button" variant="destructive" disabled={busy} onClick={() => void handleConfirm()}>
            {busy ? "Memproses…" : "Hapus"}
          </Button>
        </div>
      </div>
    </div>
  );
}
