import { NextResponse } from "next/server";

const maintenanceHtml = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Milad 114 — Santuy heula atuh Bro...</title>
  <style>
    :root {
      --navy: #1c469e;
      --navy-deep: #293a88;
      --teal: #41847d;
      --gold: #d49b0f;
      --kelor: #6dbd25;
      --ink: #fdfeff;
      --paper: #000000;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background: var(--paper);
      color: var(--ink);
      font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(60% 70% at 90% 10%, rgba(65, 132, 125, 0.16), transparent 65%),
        radial-gradient(50% 60% at 5% 95%, rgba(212, 155, 15, 0.12), transparent 60%),
        var(--paper);
    }

    .card {
      width: min(680px, 100%);
      background: #fff;
      border: 1px solid #dde3ee;
      border-radius: 6px;
      box-shadow: 0 24px 70px rgba(28, 70, 158, 0.12);
      overflow: hidden;
    }

    .topline {
      height: 6px;
      background: linear-gradient(90deg, var(--kelor), var(--teal), var(--navy), var(--gold));
    }

    .inner {
      padding: 34px 30px 30px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }

    .mark {
      width: 42px;
      height: 42px;
      flex: none;
    }

    .brand strong {
      display: block;
      color: var(--navy);
      font-family: Georgia, "Ink Free", serif;
      font-size: 20px;
      line-height: 1;
      letter-spacing: -0.01em;
    }

    .brand span {
      display: block;
      margin-top: 4px;
      color: #525b73;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .eyebrow {
      margin: 0;
      color: var(--teal);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h1 {
      margin: 10px 0 0;
      color: var(--ink);
      font-family: Georgia, "Ink Free", serif;
      font-size: clamp(32px, 6vw, 48px);
      line-height: 1.08;
      letter-spacing: -0.03em;
    }

    h1 span {
      display: block;
      color: #a66f05;
    }

    .lead {
      margin: 18px 0 0;
      max-width: 54ch;
      color: #525b73;
      font-size: 15px;
      line-height: 1.75;
    }

    .languages {
      margin-top: 24px;
      border-top: 1px solid #dde3ee;
      padding-top: 16px;
      display: grid;
      gap: 6px;
      color: #525b73;
      font-size: 12px;
      line-height: 1.6;
    }

    .languages p {
      margin: 0;
    }

    .languages .ar {
      direction: rtl;
      text-align: right;
      font-family: "Segoe UI", Ink Free, sans-serif;
    }

    .status {
      margin-top: 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid #dde3ee;
      border-radius: 3px;
      color: #0b8170;
      background: #f7fbfa;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--kelor);
      box-shadow: 0 0 0 4px rgba(109, 189, 37, 0.14);
    }

    @media (max-width: 520px) {
      .inner { padding: 26px 20px 22px; }
      .lead { font-size: 14px; }
    }
  </style>
</head>
<body>
  <main class="card">
    <div class="topline"></div>
    <div class="inner">
      <div class="brand">
        <svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6dbd25" />
              <stop offset="100%" stop-color="#0b8170" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="18" rx="10" ry="15" fill="url(#leaf)" />
          <ellipse cx="18" cy="32" rx="10" ry="15" fill="url(#leaf)" transform="rotate(-40 18 32)" />
          <ellipse cx="46" cy="32" rx="10" ry="15" fill="url(#leaf)" transform="rotate(40 46 32)" />
          <ellipse cx="32" cy="44" rx="9" ry="13" fill="url(#leaf)" />
          <path d="M32 58V36" stroke="#1c469e" stroke-width="3" stroke-linecap="round" />
        </svg>
        <div>
          <strong>Milad 114</strong>
          <span>Muhammadiyah</span>
        </div>
      </div>


      <div class="languages">
      <h1> Nuju Di Dameul Heula </h1>
        <p>The site is under maintenance. Please check back shortly.</p>
        <p class="ar">الموقع قيد الصيانة. يرجى العودة بعد قليل.</p>
      </div>

     
      </div>
    </div>
  </main>
</body>
</html>`;

export function proxy() {
  return new NextResponse(maintenanceHtml, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "retry-after": "3600",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|logo/|pattern/|og/|licenses/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|css|js|woff2?|ttf)$).*)",
  ],
};
