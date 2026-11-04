// src/data/hero-artwork.ts — milik P1
// Data karya kaligrafi "K.H. Ahmad Dahlan" untuk hero interaktif.
// Semua koordinat hotspot dalam persen (0–100) relatif terhadap
// public/media/hero/hero-artwork.jpg (1386 × 1984 px).
// Pengecualian: `path` memakai KOORDINAT PIKSEL pada viewBox 0 0 1386 1984.

export type HeroDetailId =
  | "wajah" | "matahari" | "sorban" | "baju"
  | "janggut" | "telinga" | "mata" | "kelor";

export type HeroActionId = "judul" | "tanggal";
export type HeroHotspotId = HeroDetailId | HeroActionId;

export type HeroHotspot = {
  id: HeroHotspotId;
  x: number; y: number; w: number; h: number; // persen 0–100; untuk shape non-rect = bounding box bentuknya
  shape: "ellipse" | "rect" | "polygon" | "path";
  points?: string;  // polygon: "x,y x,y ..." dalam persen gambar final
  path?: string;    // path: string SVG (boleh multi subpath utk lubang), koordinat px, viewBox 0 0 1386 1984
  fillRule?: "nonzero" | "evenodd"; // utk path berlubang pakai "evenodd"
};

export type HeroArtworkData = {
  src: string;
  width: number; height: number;
  hotspots: HeroHotspot[];
  details: Record<HeroDetailId, { src: string; width: number; height: number }>;
  actions: Record<HeroActionId, { src: string; width: number; height: number }>;
};

/*
 * Cara mengukur koordinat (revisi v4 - presisi antar-hotspot, tanpa irisan;
 * penajaman v4.1-v4.3, lihat butir 5/6b):
 * 1. Gambar hero final (hero-artwork.jpg, 1386 × 1984) TIDAK diubah; semua
 *    koordinat diukur padanya (turunan foto sumber; tidak disertakan di repo).
 * 2. Metode objektif: mask tinta (g < 138) diprofil per kolom/baris (langkah
 *    0,5–1%) untuk batas sorban/hairline/wajah; mask warna biru
 *    (B − max(R,G) > 15) untuk lambang kelor & matahari; mask biru-gelap
 *    (navy, R < 110) + fit ellipse utk cakram & pita teks logo.
 * 3. 01 `wajah` = path evenodd: poligon profil wajah (tepi atas mengikuti
 *    garis rambut + gap) dengan DUA LUBANG mata (07a/07b + ~3 px) — sehingga
 *    wajah tidak menumpuk hotspot mata.
 * 4. 03 `sorban` = path evenodd: poligon batas sorban/hairline (78 titik,
 *    hasil profil tinta) dengan LUBANG telinga (06 + ~2 px).
 * 5. 04 `baju` = DUA entri `path` (revisi v4.1, contoh anotasi pemilik):
 *    poligon KETAT mengikuti kontur teks
 *    (bukan kotak/trapesium besar — tanpa kertas kosong, tanpa kelor):
 *    04a = blok Ayat Kursi (2 subpath disjoint); 04b = gugus kaligrafi di
 *    sekeliling logo matahari (4 subpath; v4.3: fragmen kecil yang jatuh di
 *    dalam chord 02 dikeluarkan — "fragmen mengalah", keputusan pemilik).
 *    Loop disjoint pada evenodd = union.
 * 6. 08 `kelor` = poligon ketat kontur bunga + kepala (mask biru; v4.1
 *    mengganti ellipse). Ekor kata "wa" menyentuh kepala kelor di karya;
 *    poligon mengikuti kontur biru sehingga tidak memotong kaligrafi lain.
 * 6b. 02 `matahari` = SILUET bintang 12 sinar (v4.3, arahan pemilik: lambang
 *     pada lukisan = bintang 12 sudut logo Muhammadiyah; koreksi pemilik:
 *     bintang 12 sudut dengan garis lurus PASTI memunculkan LEMBAH, jadi
 *     poligonnya LEBIH BANYAK titik daripada 12): 24 VERTEX berselang-seling
 *     - 12 UJUNG sinar (diukur objektif dari mask biru: blob lambang utuh
 *     closing 6, profil radial r(theta) per 1 derajat, scipy.signal.find_peaks
 *     prominence 20 / distance 8, jarak antar sinar 26-35 derajat, semua di
 *     rim r >= 161 px) + 12 LEMBAH di antara dua sinar (argmin r(theta) di
 *     tengah sektor, 20-80% span; radius = tepi luar biru di lembah, r
 *     105-138 px) - semua dihubungkan GARIS LURUS tanpa vertex lain, TANPA
 *     DP. Kaligrafi cakram, pita teks, dan isi bintang berada di dalam
 *     poligon tanpa dipotong (disengaja); teks biru lepas tidak ikut.
 * 7. Bukti presisi (skrip rasterisasi, 1386 × 1984): intersection 66 pasangan
 *    entri = 0 px; jarak minimum antar entri ≥ 2,0 px.
 * 9. Hit area: semua ≥ 44 px KECUALI ring mata 07a (≈ 32 px) & 07b (≈ 27 px)
 *    — sengaja, presisi didahulukan; P2/P3 diminta menambah padding sentuh
 *    tak terlihat ≥ 44 px di komponen.
 * 10. Verifikasi visual: public/media/hero/hotspots-preview.jpg (12 hotspot),
 *     hotspots-face-preview.jpg (zoom wajah + gap), hotspots-baju-preview.jpg
 *     (zoom baju: 04a, 04b, 02, 05, 08 + gap).
 */
export const heroArtwork: HeroArtworkData = {
  src: "/media/hero/hero-artwork.jpg",
  width: 1386,
  height: 1984,
  hotspots: [
    // --- aksi (emas pada overlay) ---
    { id: "judul", x: 29.5, y: 3.8, w: 49.6, h: 8.2, shape: "rect" },
    { id: "tanggal", x: 25.8, y: 13.0, w: 57.9, h: 3.6, shape: "rect" },
    // --- detail (merah pada overlay; garis biru = lubang) ---
    // 01 wajah: profil wajah + lubang kedua mata (evenodd)
    {
      id: "wajah", x: 54.9, y: 32.5, w: 16.1, h: 17.2, shape: "path",
      fillRule: "evenodd",
      path: "M762.3,658.7 L803.9,648.8 L845.5,644.8 L880.1,648.8 L907.8,664.6 L932.8,684.5 L956.3,704.3 L970.2,728.1 L981.3,765.8 L984.1,833.3 L979.9,892.8 L977.1,942.4 L975.7,986.0 L778.9,986.0 L765.1,912.6 L760.9,833.3 L762.3,753.9 Z M872.1,767.8 A28.0,19.0 0 1,0 816.1,767.8 A28.0,19.0 0 1,0 872.1,767.8 Z M973.5,766.3 A25.5,16.5 0 1,0 922.5,766.3 A25.5,16.5 0 1,0 973.5,766.3 Z",
    },
    // 02 matahari: siluet bintang 12 sinar (v4.3, arahan pemilik) - 24 vertex
    // berselang-seling: 12 ujung sinar (profil r(theta) mask biru + find_peaks
    // prom 20, dist 8) + 12 lembah di tepi biru antar sinar; garis lurus semua,
    // tanpa vertex lain; isi lambang (kaligrafi cakram + pita) di dalam
    // poligon, disengaja
    {
      id: "matahari", x: 56.64, y: 65.07, w: 24.10, h: 19.20, shape: "path",
      fillRule: "evenodd",
      path: "M1074,1496 L1118,1545 L1039,1557 L1062,1628 L990,1593 L964,1672 L930,1602 L875,1649 L879,1570 L806,1581 L843,1522 L785,1496 L841,1452 L814,1401 L870,1395 L860,1333 L913,1358 L936,1291 L977,1352 L1031,1311 L1033,1382 L1091,1372 L1064,1434 L1119,1456 Z",
    },
    // 03 sorban: batas sorban/hairline + lubang telinga (evenodd)
    {
      id: "sorban", x: 29.5, y: 20.8, w: 42.0, h: 33.0, shape: "path",
      fillRule: "evenodd",
      path: "M991.0,654.7 L977.1,571.4 L949.4,541.6 L921.7,511.9 L887.0,490.0 L859.3,488.1 L831.6,454.3 L803.9,448.4 L790.0,412.7 L762.3,430.5 L748.4,434.5 L734.6,442.4 L720.7,470.2 L693.0,478.1 L679.1,466.2 L665.3,470.2 L651.4,464.3 L637.6,476.2 L623.7,480.1 L609.8,490.0 L582.1,498.0 L554.4,529.7 L540.5,531.7 L526.7,541.6 L512.8,559.5 L499.0,579.3 L485.1,609.1 L471.2,619.0 L457.4,634.9 L443.5,650.8 L429.7,692.4 L428.3,694.4 L415.8,714.2 L413.0,734.1 L408.9,753.9 L410.3,773.8 L414.4,793.6 L410.3,813.4 L411.6,833.3 L426.9,853.1 L450.4,873.0 L453.2,892.8 L467.1,912.6 L469.9,932.5 L500.3,952.3 L525.3,972.2 L543.3,992.0 L553.0,1011.8 L557.2,1031.7 L573.8,1051.5 L589.0,1067.4 L604.3,1059.5 L616.8,1041.6 L625.1,992.0 L622.3,972.2 L619.5,952.3 L640.3,960.3 L640.3,892.8 L644.5,888.8 L648.6,884.9 L648.6,863.0 L645.9,849.2 L641.7,829.3 L641.7,805.5 L651.4,777.7 L666.7,736.1 L680.5,652.7 L702.7,640.8 L723.5,615.0 L751.2,619.0 L778.9,607.1 L806.7,603.1 L834.4,599.2 L862.1,595.2 L889.8,619.0 L917.5,634.9 L945.3,656.7 L964.7,654.7 L978.5,710.3 Z M606.3,883.9 A38.0,62.5 0 1,0 530.3,883.9 A38.0,62.5 0 1,0 606.3,883.9 Z",
    },
    // 04a baju (utama): poligon ketat mengikuti kontur teks Ayat Kursi
    // (2 subpath disjoint = union; tanpa kertas kosong, tanpa kelor)
    {
      id: "baju", x: 23.59, y: 56.35, w: 34.78, h: 25.25, shape: "path",
      fillRule: "evenodd",
      path: "M327,1316 L330,1348 L355,1374 L385,1373 L418,1344 L424,1349 L423,1381 L398,1412 L431,1384 L456,1371 L462,1376 L437,1397 L442,1439 L420,1458 L455,1447 L476,1393 L488,1380 L500,1381 L521,1370 L542,1386 L540,1396 L548,1389 L568,1413 L567,1439 L561,1445 L550,1439 L546,1446 L556,1451 L577,1444 L585,1451 L599,1434 L637,1413 L684,1373 L702,1368 L720,1349 L755,1330 L760,1317 L743,1284 L778,1257 L787,1262 L797,1301 L802,1301 L791,1261 L802,1253 L799,1241 L809,1233 L803,1218 L809,1205 L809,1121 L759,1120 L777,1135 L788,1166 L800,1181 L791,1194 L780,1173 L765,1160 L699,1119 L685,1120 L773,1180 L791,1226 L786,1232 L798,1235 L758,1268 L752,1264 L721,1289 L691,1293 L682,1284 L716,1251 L690,1207 L626,1258 L619,1252 L661,1210 L669,1213 L681,1197 L659,1152 L650,1157 L644,1152 L651,1137 L638,1121 L601,1118 L595,1123 L590,1119 L509,1188 L504,1185 L476,1207 L463,1238 L466,1243 L457,1249 L460,1272 L467,1278 L465,1292 L471,1298 L466,1304 L448,1316 L442,1311 L450,1300 L444,1275 L448,1270 L438,1235 L430,1233 L377,1273 L368,1272 L341,1287 Z M620,1439 L627,1453 L627,1479 L635,1490 L623,1519 L643,1494 L666,1478 L673,1484 L695,1458 L726,1435 L733,1431 L740,1438 L695,1483 L676,1487 L647,1507 L650,1551 L628,1583 L648,1566 L659,1573 L677,1562 L720,1520 L740,1518 L745,1524 L732,1537 L706,1551 L703,1574 L696,1580 L715,1611 L733,1619 L760,1606 L809,1554 L809,1535 L800,1529 L802,1514 L798,1517 L777,1499 L782,1511 L777,1517 L754,1507 L781,1480 L786,1483 L809,1465 L809,1410 L804,1402 L795,1408 L788,1402 L799,1390 L798,1375 L770,1330 L708,1380 L703,1377 L639,1426 L633,1423 Z",
    },
    // 04b baju (kecil): gugus kaligrafi di sekeliling logo matahari
    // (4 subpath disjoint; v4.3: fragmen yang jatuh di dalam siluet bintang
    // 02 dikeluarkan - "fragmen mengalah", keputusan pemilik; tidak menyentuh 02)
    {
      id: "baju", x: 58.59, y: 56.35, w: 25.33, h: 22.43, shape: "path",
      fillRule: "evenodd",
      path: "M812,1120 L812,1167 L825,1154 L832,1164 L830,1198 L812,1219 L814,1227 L819,1223 L824,1228 L820,1274 L826,1270 L829,1236 L848,1207 L860,1222 L856,1247 L868,1243 L886,1254 L872,1264 L853,1264 L830,1286 L819,1279 L824,1288 L821,1301 L828,1307 L833,1337 L840,1346 L825,1367 L828,1370 L852,1344 L853,1326 L876,1330 L909,1300 L921,1298 L934,1277 L947,1278 L979,1247 L986,1229 L962,1190 L950,1205 L902,1237 L897,1232 L902,1224 L929,1204 L921,1186 L925,1181 L899,1155 L880,1172 L875,1196 L859,1204 L852,1187 L861,1177 L851,1182 L839,1169 L840,1123 L835,1118 Z M952,1284 L953,1300 L971,1313 L965,1321 L980,1338 L1032,1297 L1043,1297 L1068,1265 L1058,1249 L1025,1229 Z M1039,1321 L1039,1343 L1056,1369 L1072,1366 L1108,1323 L1096,1304 L1097,1295 L1080,1279 L1062,1301 L1048,1307 L1052,1316 Z M1091,1417 L1105,1412 L1111,1418 L1114,1442 L1127,1455 L1101,1482 L1106,1492 L1103,1515 L1156,1563 L1156,1555 L1128,1533 L1163,1506 L1152,1411 L1143,1403 L1146,1396 L1137,1385 L1137,1373 L1126,1366 L1123,1347 L1110,1361 L1104,1359 L1094,1383 L1104,1405 Z",
    },
    // 05 janggut: massa jenggot dagu (misai/bibir di luar)
    { id: "janggut", x: 56.4, y: 49.9, w: 14.1, h: 5.8, shape: "ellipse" },
    // 06 telinga: palung telinga (terkecuali dari 03 via lubang evenodd)
    { id: "telinga", x: 38.4, y: 41.5, w: 5.2, h: 6.1, shape: "ellipse" },
    // 07 mata: dua entri id "mata" (kiri/kanan gambar), tanpa alis
    { id: "mata", x: 59.1, y: 37.9, w: 3.6, h: 1.6, shape: "ellipse" },
    { id: "mata", x: 66.8, y: 37.95, w: 3.2, h: 1.35, shape: "ellipse" },
    // 08 kelor: poligon ketat mengikuti kontur bunga + kepala (contoh pemilik)
    {
      id: "kelor", x: 28.64, y: 69.76, w: 15.87, h: 11.69, shape: "path",
      fillRule: "evenodd",
      path: "M397,1581 L421,1614 L437,1616 L474,1610 L478,1613 L487,1604 L493,1613 L529,1612 L534,1603 L519,1590 L521,1586 L535,1599 L551,1606 L590,1603 L606,1591 L617,1571 L606,1545 L584,1529 L599,1519 L612,1502 L611,1476 L600,1461 L581,1454 L539,1459 L544,1423 L538,1402 L518,1384 L499,1385 L485,1395 L472,1415 L471,1439 L479,1461 L448,1458 L422,1466 L416,1464 L416,1470 L404,1481 L401,1519 L431,1538 L425,1547 L415,1547 L409,1559 L401,1557 L403,1577 Z",
    },
  ],
  details: {
    wajah: { src: "/media/hero/details/wajah.jpg", width: 597, height: 700 },
    matahari: { src: "/media/hero/details/matahari.jpg", width: 545, height: 700 },
    sorban: { src: "/media/hero/details/sorban.jpg", width: 590, height: 662 },
    baju: { src: "/media/hero/details/baju.jpg", width: 408, height: 700 },
    janggut: { src: "/media/hero/details/janggut.jpg", width: 612, height: 605 },
    telinga: { src: "/media/hero/details/telinga.jpg", width: 363, height: 524 },
    mata: { src: "/media/hero/details/mata.jpg", width: 386, height: 323 },
    kelor: { src: "/media/hero/details/kelor.jpg", width: 687, height: 700 },
  },
  actions: {
    judul: { src: "/media/hero/details/judul.jpg", width: 689, height: 171 },
    tanggal: { src: "/media/hero/details/tanggal.jpg", width: 802, height: 71 },
  },
};
