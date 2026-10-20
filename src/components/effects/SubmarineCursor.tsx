import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useSettings } from "@/features/settings/hooks/useSettings";
import type { SubmarineSettings } from "@/features/settings/types";
import { DEFAULT_SUBMARINE, resolveSubmarine } from "@/features/settings/lib/submarine";
import { setBeamLightSampler, submarinePose } from "@/lib/beam-light";

// ============================================================================
// SubmarineCursor — SATU sistem terpadu:
//   mouse -> target -> submarine (lerp) -> rotasi (atan2 arah) -> hidung kapal
//         -> light source (glow di hidung) -> beam (mengikuti arah hadap).
// Tidak ada state posisi/rotasi terpisah antara submarine dan cahaya.
//
// Semua parameter (sensitivitas, smoothness, spread, range, intensitas, glow,
// visibilitas) dibaca dari settings.submarine (Supabase) SECARA LIVE via ref,
// tanpa restart loop. Darkness/masking NYATA: halaman digelapkan, hanya area
// tersorot beam + ambience sekitar kapal yang terlihat.
// ============================================================================

const SUB_W = 52;
const SUB_H = 20;
const NOSE_OFFSET = SUB_W / 2 - 2; // hidung dari pusat (sumbu-x lokal)

// Toleransi klik sedikit di luar gambar SVG (px). Membuat seluruh area gambar
// kapal selam "ramah klik" tanpa mengganggu klik di sekitar yang sangat dekat.
const HIT_PAD = 4;

// Simbol penanda untuk event klik sintetis yang kita dispatch sendiri.
// Dipakai sebagai anti-recursion: handler mengabaikan eventnya sendiri.
const SYNTH_CLICK = Symbol("submarine.syntheticClick");

// Event MouseEvent yang membawa penanda simbol di atas (untuk type-check TS).
type SynthClickEvent = MouseEvent & { [SYNTH_CLICK]: boolean };

function wrapAngle(a: number) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export function SubmarineCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { data: settings } = useSettings();

  const raw: SubmarineSettings = { ...DEFAULT_SUBMARINE, ...((settings?.submarine as Partial<SubmarineSettings>) ?? {}) };
  const settingsRef = useRef(raw);
  settingsRef.current = raw;

  const routeEnabled = !location.pathname.startsWith("/admin") && location.pathname !== "/login";
  const enabled = routeEnabled && raw.enabled !== false;

  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    const sub = subRef.current;
    if (!canvas || !sub) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    // DPR dibatasi 1 (retina dinonaktifkan) agar skala canvas == skala elemen
    // SVG/DOM -> tidak ada drift koordinat, dan jauh lebih ringan.

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, w, h);
    }
    resize();

    const target = { x: w / 2, y: h * 0.4 };
    const smooth = { x: w / 2, y: h / 2 };
    let angle = 0;
    let hasMoved = false;
    let raf = 0;
    let warned = false;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      hasMoved = true;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    // ==========================================================================
    // KLIK KAPAL = KLIK — seluruh gambar kapal selam menjadi area klik.
    //
    // Kapal selam berfungsi sebagai kursor visual, tetapi ia LERP mengikuti mouse
    // sehingga sering "tertinggal" dari titik klik asli. Saat titik klik asli
    // jatuh DI DALAM area gambar kapal (sadar-rotasi), kita alihkan aktivasi ke
    // elemen yang berada DI BAWAH HIDUNG kapal (nose point = arah hadap), sehingga
    // mengeklik di mana pun di badan/ekor/sail kapal "mengklik" apa yang sedang
    // ditunjuk hidung kapal.
    // ==========================================================================
    function onClick(e: MouseEvent) {
      // Anti-recursion: abaikan event klik sintetis yang kita dispatch sendiri.
      if ((e as SynthClickEvent)[SYNTH_CLICK]) return;

      // ---- Hit-test sadar-rotasi ----
      // Posisi klik asli relatif terhadap pusat kapal, di-rotasi balik sebesar
      // -angle sehingga menjadi koordinat lokal kapal (sumbu-x = arah hadap).
      const dx = e.clientX - smooth.x;
      const dy = e.clientY - smooth.y;
      const ca = Math.cos(-angle);
      const sa = Math.sin(-angle);
      const lx = dx * ca - dy * sa;
      const ly = dx * sa + dy * ca;

      // Di luar area kapal -> jangan campuri sama sekali (perilaku normal).
      if (Math.abs(lx) > SUB_W / 2 + HIT_PAD) return;
      if (Math.abs(ly) > SUB_H / 2 + HIT_PAD) return;

      // ---- Hitung nose point (sama persis seperti di paint()) ----
      const nx = smooth.x + Math.cos(angle) * NOSE_OFFSET;
      const ny = smooth.y + Math.sin(angle) * NOSE_OFFSET;

      // Elemen paling atas di bawah hidung, yang BUKAN bagian kapal.
      // elementsFromPoint tidak menyertakan elemen pointer-events:none (canvas &
      // wrapper kapal), tapi filter ini tetap dijaga sebagai jaring pengaman.
      const stack = document.elementsFromPoint(nx, ny);
      const target = stack.find((el) => !sub!.contains(el) && el !== canvas);
      if (!target) return;

      // Guard anti-duplikat: bila titik klik asli ALREADY berada di atas target
      // yang sama, klik asli akan meng-aktivasi target secara alami — biarkan
      // berjalan, jangan dispatch apa pun (mencegah klik ganda).
      const originalTarget = document.elementFromPoint(e.clientX, e.clientY);
      if (originalTarget === target) return;

      // Supresi klik asli (bila aman): stop propagasi + batalkan default action
      // (mis. navigasi <a>) agar target tidak ter-aktivasi dua kali.
      e.stopPropagation();
      e.preventDefault();

      // Dispatch klik sintetis ke target, berlabel anti-recursion.
      const synthetic = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: nx,
        clientY: ny,
      });
      Object.defineProperty(synthetic, SYNTH_CLICK, { value: true });
      target.dispatchEvent(synthetic);
    }
    window.addEventListener("click", onClick);

    // Sampler cahaya — dipakai SwarmCursor (sampleBeamLight) agar particle/swarm
    // ikut ter-gate oleh beam: di luar beam -> gelap/tidak digambar.
    function lightAt(x: number, y: number): number {
      const cfg = resolveSubmarine(settingsRef.current);
      const nx = smooth.x + Math.cos(angle) * NOSE_OFFSET;
      const ny = smooth.y + Math.sin(angle) * NOSE_OFFSET;
      const dx = x - nx;
      const dy = y - ny;
      const dist = Math.hypot(dx, dy) || 1e-6;
      if (dist > cfg.reach) return 0;
      let delta = Math.atan2(dy, dx) - angle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      const angular = Math.max(0, 1 - Math.abs(delta) / cfg.spread);
      const range = Math.max(0, 1 - dist / cfg.reach);
      return angular * (0.3 + 0.7 * range);
    }
    setBeamLightSampler(lightAt);

    function paint() {
      const cfg = resolveSubmarine(settingsRef.current);
      const nx = smooth.x + Math.cos(angle) * NOSE_OFFSET;
      const ny = smooth.y + Math.sin(angle) * NOSE_OFFSET;

      ctx!.clearRect(0, 0, w, h);

      // ---- 1) Darkness (dikendalikan oleh illumination) ----
      ctx!.fillStyle = `rgba(2,8,12,${cfg.darkness})`;
      ctx!.fillRect(0, 0, w, h);

      // ---- 2) Buka area tersorot (destination-out) ----
      ctx!.globalCompositeOperation = "destination-out";

      // Cone inti — kelembutan tepi dari softness.
      const core = ctx!.createRadialGradient(nx, ny, 0, nx, ny, cfg.reach);
      const edge = 0.55 + cfg.softness * 0.25; // makin soft, stop tengah makin tinggi
      core.addColorStop(0, "rgba(0,0,0,0.98)");
      core.addColorStop(edge, "rgba(0,0,0,0.6)");
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = core;
      ctx!.beginPath();
      ctx!.moveTo(nx, ny);
      ctx!.arc(nx, ny, cfg.reach, angle - cfg.spread, angle + cfg.spread);
      ctx!.closePath();
      ctx!.fill();

      // Cone atmosfer lebar.
      ctx!.beginPath();
      ctx!.moveTo(nx, ny);
      ctx!.arc(nx, ny, cfg.reach * 0.9, angle - cfg.wideSpread, angle + cfg.wideSpread);
      ctx!.closePath();
      const wide = ctx!.createRadialGradient(nx, ny, 0, nx, ny, cfg.reach * 0.9);
      wide.addColorStop(0, "rgba(0,0,0,0.38)");
      wide.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = wide;
      ctx!.fill();

      // Ambience sekitar kapal.
      const amb = ctx!.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 230);
      amb.addColorStop(0, "rgba(0,0,0,0.7)");
      amb.addColorStop(0.6, "rgba(0,0,0,0.28)");
      amb.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = amb;
      ctx!.beginPath();
      ctx!.arc(smooth.x, smooth.y, 230, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.globalCompositeOperation = "source-over";

      // ---- 3) Tint beam (intensitas) ----
      ctx!.globalCompositeOperation = "lighter";
      const tint = ctx!.createLinearGradient(
        nx, ny,
        nx + Math.cos(angle) * cfg.reach,
        ny + Math.sin(angle) * cfg.reach,
      );
      tint.addColorStop(0, `rgba(180,255,245,${0.2 * cfg.intensity})`);
      tint.addColorStop(0.5, `rgba(150,235,225,${0.07 * cfg.intensity})`);
      tint.addColorStop(1, "rgba(140,220,210,0)");
      ctx!.fillStyle = tint;
      ctx!.beginPath();
      ctx!.moveTo(nx, ny);
      ctx!.arc(nx, ny, cfg.reach, angle - cfg.spread, angle + cfg.spread);
      ctx!.closePath();
      ctx!.fill();
      ctx!.globalCompositeOperation = "source-over";

      // ---- 4) Glow sumber cahaya di hidung (glow) ----
      const gr = 30 * cfg.glow;
      const glow = ctx!.createRadialGradient(nx, ny, 0, nx, ny, gr);
      glow.addColorStop(0, `rgba(244,255,252,${0.9 * Math.min(cfg.intensity, 1.2)})`);
      glow.addColorStop(0.35, `rgba(190,255,245,${0.45 * cfg.intensity})`);
      glow.addColorStop(1, "rgba(170,235,225,0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(nx, ny, gr, 0, Math.PI * 2);
      ctx!.fill();
    }

    function frame() {
      const cfg = resolveSubmarine(settingsRef.current);
      smooth.x += (target.x - smooth.x) * cfg.lerp;
      smooth.y += (target.y - smooth.y) * cfg.lerp;
      // Bagikan posisi aktual submarine agar swarm mengikuti submarine (bukan mouse).
      submarinePose.x = smooth.x;
      submarinePose.y = smooth.y;
      submarinePose.active = true;
      if (hasMoved) {
        const dx = target.x - smooth.x;
        const dy = target.y - smooth.y;
        if (Math.hypot(dx, dy) > 1.2) {
          const desired = Math.atan2(dy, dx);
          angle += wrapAngle(desired - angle) * cfg.angleLerp;
        }
      }
      sub!.style.transform = `translate(${smooth.x - SUB_W / 2}px, ${smooth.y - SUB_H / 2}px) rotate(${angle}rad)`;

      // DEBUG: bandingkan posisi AKTUAL submarine di DOM vs nilai smooth (satu
      // per frame pertama lalu diam). Jika beda > 2px, ada bug transform/parent.
      const r = sub!.getBoundingClientRect();
      const actualCx = r.left + r.width / 2;
      const actualCy = r.top + r.height / 2;
      const dx = actualCx - smooth.x;
      const dy = actualCy - smooth.y;
      if (Math.hypot(dx, dy) > 2 && !warned) {
        warned = true;
        console.warn(
          "[submarine-debug] MISMATCH actual-center=",
          { x: +actualCx.toFixed(1), y: +actualCy.toFixed(1) },
          "smooth=",
          { x: +smooth.x.toFixed(1), y: +smooth.y.toFixed(1) },
          "delta=",
          { dx: +dx.toFixed(1), dy: +dy.toFixed(1) },
        );
      }

      paint();
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      setBeamLightSampler(null);
      submarinePose.active = false;
      ctx.clearRect(0, 0, w, h);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`html, body, body * { cursor: none !important; }`}</style>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden />
      <div ref={subRef} className="pointer-events-none fixed left-0 top-0 z-[10001]" aria-hidden>
        <svg width={SUB_W} height={SUB_H} viewBox={`0 0 ${SUB_W} ${SUB_H}`} className="overflow-visible">
          <defs>
            <linearGradient id="subHull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dffaf4" />
              <stop offset="0.5" stopColor="#79c4b8" />
              <stop offset="1" stopColor="#2e5750" />
            </linearGradient>
          </defs>
          {/* Propeller di EKOR (kiri). */}
          <g transform={`translate(${SUB_W * 0.05} ${SUB_H / 2})`}>
            <path d="M0 0 L3 -4 L0 -1 Z" fill="#c9eee7" />
            <path d="M0 0 L3 4 L0 1 Z" fill="#c9eee7" />
            <circle r={1.2} fill="#0b1a19" />
          </g>
          {/* Badan. */}
          <ellipse cx={SUB_W / 2} cy={SUB_H / 2} rx={SUB_W / 2} ry={7} fill="url(#subHull)" stroke="#0b1a19" strokeWidth="1" />
          {/* Sail & periskop. */}
          <rect x={SUB_W * 0.42} y={3} width={10} height={8} rx={2} fill="#8ccbc0" stroke="#0b1a19" strokeWidth="1" />
          <rect x={SUB_W * 0.5} y={0} width={2} height={5} fill="#c9eee7" />
          {/* Jendela. */}
          <circle cx={SUB_W * 0.3} cy={SUB_H / 2} r={2} fill="#c9eee7" />
          {/* Hidung / lampu (KANAN, depan) — origin beam di sini. */}
          <circle cx={SUB_W - 2} cy={SUB_H / 2} r={2.2} fill="#f4fffb" />
        </svg>
      </div>
    </>
  );
}
