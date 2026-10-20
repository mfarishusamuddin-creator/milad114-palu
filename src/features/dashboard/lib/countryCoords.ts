// ============================================================================
// Lookup statis negara → koordinat (centroid perkiraan — presisi cukup untuk
// pin peta, bukan batas teritorial).
//
// TANPA API geocoding eksternal: prinsip no-external-key project ini (preseden
// WorldMapWidget — pure SVG tanpa tile/API/key). Data negara praktis tidak
// berubah, jadi tabel statis lebih andal, offline-friendly, dan nol biaya.
//
// Kunci: kode ISO-3166-1 alpha-2 + nama umum Inggris & Indonesia, semua
// dinormalkan lowercase. Unknown → null — pemanggil (adapter geo) skip item
// dan melaporkannya lewat diagnostic; koordinat tebakan lebih berbahaya
// daripada item yang hilang.
// ============================================================================

export interface CountryCoords {
  lat: number;
  lng: number;
}

// Tiap baris: koordinat + semua alias yang menunjuk padanya (ISO alpha-2,
// nama Inggris, nama Indonesia). Peta alias dibangun sekali saat modul dimuat.
const ENTRIES: readonly [coords: CountryCoords, aliases: readonly string[]][] = [
  // Asia Tenggara
  [{ lat: -2.5, lng: 118 }, ["id", "indonesia"]],
  [{ lat: 4.21, lng: 101.98 }, ["my", "malaysia"]],
  [{ lat: 1.35, lng: 103.82 }, ["sg", "singapore", "singapura"]],
  [{ lat: 15.87, lng: 100.99 }, ["th", "thailand"]],
  [{ lat: 14.06, lng: 108.28 }, ["vn", "vietnam"]],
  [{ lat: 12.88, lng: 121.77 }, ["ph", "philippines", "filipina"]],
  [{ lat: 12.57, lng: 104.99 }, ["kh", "cambodia", "kamboja"]],
  [{ lat: 19.86, lng: 102.5 }, ["la", "laos"]],
  [{ lat: 19.77, lng: 96.08 }, ["mm", "myanmar"]],
  [{ lat: 4.54, lng: 114.73 }, ["bn", "brunei"]],
  [{ lat: -8.87, lng: 125.73 }, ["tl", "timor-leste", "timor leste"]],
  // Asia Timur & Selatan
  [{ lat: 35.86, lng: 104.2 }, ["cn", "china", "cina", "tiongkok"]],
  [{ lat: 36.2, lng: 138.25 }, ["jp", "japan", "jepang"]],
  [{ lat: 35.91, lng: 127.77 }, ["kr", "south korea", "korea selatan"]],
  [{ lat: 40.34, lng: 127.51 }, ["kp", "north korea", "korea utara"]],
  [{ lat: 20.59, lng: 78.96 }, ["in", "india"]],
  [{ lat: 30.38, lng: 69.35 }, ["pk", "pakistan"]],
  [{ lat: 23.68, lng: 90.36 }, ["bd", "bangladesh"]],
  [{ lat: 7.87, lng: 80.77 }, ["lk", "sri lanka"]],
  [{ lat: 28.39, lng: 84.12 }, ["np", "nepal"]],
  [{ lat: 33.94, lng: 67.71 }, ["af", "afghanistan"]],
  [{ lat: 41.38, lng: 64.59 }, ["uz", "uzbekistan"]],
  [{ lat: 48.02, lng: 66.92 }, ["kz", "kazakhstan"]],
  // Timur Tengah
  [{ lat: 23.89, lng: 45.08 }, ["sa", "saudi arabia", "arab saudi"]],
  [{ lat: 23.42, lng: 53.85 }, ["ae", "united arab emirates", "uni emirat arab"]],
  [{ lat: 25.35, lng: 51.18 }, ["qa", "qatar"]],
  [{ lat: 29.31, lng: 47.48 }, ["kw", "kuwait"]],
  [{ lat: 26.07, lng: 50.55 }, ["bh", "bahrain"]],
  [{ lat: 21.47, lng: 55.98 }, ["om", "oman"]],
  [{ lat: 15.55, lng: 48.52 }, ["ye", "yemen", "yaman"]],
  [{ lat: 30.59, lng: 36.24 }, ["jo", "jordan", "yordania"]],
  [{ lat: 33.85, lng: 35.86 }, ["lb", "lebanon"]],
  [{ lat: 34.8, lng: 38.99 }, ["sy", "syria", "suriah"]],
  [{ lat: 33.22, lng: 43.68 }, ["iq", "iraq"]],
  [{ lat: 32.43, lng: 53.69 }, ["ir", "iran"]],
  [{ lat: 31.05, lng: 34.85 }, ["il", "israel"]],
  [{ lat: 38.96, lng: 35.24 }, ["tr", "turkiye", "turkey", "turki"]],
  // Afrika
  [{ lat: 26.82, lng: 30.8 }, ["eg", "egypt", "mesir"]],
  [{ lat: 26.34, lng: 17.23 }, ["ly", "libya"]],
  [{ lat: 28.03, lng: 1.66 }, ["dz", "algeria", "aljazair"]],
  [{ lat: 31.79, lng: -7.09 }, ["ma", "morocco", "maroko"]],
  [{ lat: 9.08, lng: 8.68 }, ["ng", "nigeria"]],
  [{ lat: -0.02, lng: 37.91 }, ["ke", "kenya"]],
  [{ lat: -30.56, lng: 22.94 }, ["za", "south africa", "afrika selatan"]],
  // Amerika
  [{ lat: 37.09, lng: -95.71 }, ["us", "usa", "united states", "united states of america", "amerika serikat"]],
  [{ lat: 56.13, lng: -106.35 }, ["ca", "canada", "kanada"]],
  [{ lat: 23.63, lng: -102.55 }, ["mx", "mexico", "meksiko"]],
  [{ lat: -14.24, lng: -51.93 }, ["br", "brazil", "brasil"]],
  [{ lat: -38.42, lng: -63.62 }, ["ar", "argentina"]],
  // Eropa
  [{ lat: 55.38, lng: -3.44 }, ["gb", "uk", "united kingdom", "inggris"]],
  [{ lat: 53.14, lng: -7.69 }, ["ie", "ireland", "irlandia"]],
  [{ lat: 46.23, lng: 2.21 }, ["fr", "france", "prancis"]],
  [{ lat: 40.46, lng: -3.75 }, ["es", "spain", "spanyol"]],
  [{ lat: 39.4, lng: -8.22 }, ["pt", "portugal"]],
  [{ lat: 41.87, lng: 12.56 }, ["it", "italy", "italia"]],
  [{ lat: 51.17, lng: 10.45 }, ["de", "germany", "jerman"]],
  [{ lat: 52.13, lng: 5.29 }, ["nl", "netherlands", "belanda"]],
  [{ lat: 50.5, lng: 4.47 }, ["be", "belgium", "belgia"]],
  [{ lat: 46.82, lng: 8.23 }, ["ch", "switzerland", "swiss"]],
  [{ lat: 47.52, lng: 14.55 }, ["at", "austria"]],
  [{ lat: 51.92, lng: 19.15 }, ["pl", "poland", "polandia"]],
  [{ lat: 60.13, lng: 18.64 }, ["se", "sweden", "swedia"]],
  [{ lat: 60.47, lng: 8.47 }, ["no", "norway", "norwegia"]],
  [{ lat: 56.26, lng: 9.5 }, ["dk", "denmark"]],
  [{ lat: 61.92, lng: 25.75 }, ["fi", "finland", "finlandia"]],
  [{ lat: 61.52, lng: 105.32 }, ["ru", "russia", "rusia"]],
  [{ lat: 48.38, lng: 31.17 }, ["ua", "ukraine", "ukraina"]],
  [{ lat: 39.07, lng: 21.82 }, ["gr", "greece", "yunani"]],
  // Oseania
  [{ lat: -25.27, lng: 133.78 }, ["au", "australia"]],
  [{ lat: -40.9, lng: 174.89 }, ["nz", "new zealand", "selandia baru"]],
];

const COORDS_BY_ALIAS: Record<string, CountryCoords> = {};
for (const [coords, aliases] of ENTRIES) {
  for (const alias of aliases) {
    COORDS_BY_ALIAS[alias] = coords;
  }
}

/**
 * Cari koordinat negara by kode ISO-3166-1 alpha-2 atau nama umum (Inggris/
 * Indonesia), case-insensitive. Unknown → null (pemanggil skip + diagnostic).
 *
 * Normalisasi sengaja MINIM (trim + lowercase + rapatkan spasi): tanpa fuzzy
 * matching, karena kecocokan palsu ("ind" → india vs indonesia) lebih merusak
 * daripada miss yang teramati di diagnostic.
 */
export function lookupCountryCoords(input: string): CountryCoords | null {
  const key = input.trim().toLowerCase().replace(/\s+/g, " ");
  return COORDS_BY_ALIAS[key] ?? null;
}
