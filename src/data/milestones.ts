export type Branch = "akar" | "batang" | "kanopi";

export type SourceRef = {
  label: string;
  url: string;
};

export type Milestone = {
  id: string;
  year: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  facts?: string[];
  sources: SourceRef[];
  branch: Branch;
  verified: boolean;
};

export const milestones: Milestone[] = [
  {
    id: "akar-kauman",
    year: "1868–1911",
    kicker: "Akar",
    title: "Kauman dan ruang tamu yang menjadi sekolah",
    paragraphs: [
      "Ahmad Dahlan lahir di Kampung Kauman, Yogyakarta, pada 1868 dengan nama Muhammad Darwis. Ia tumbuh di lingkungan masjid dan pesantren, lalu menempuh perjalanan ilmu hingga ke Mekah.",
      "Pada 1 Desember 1911, Madrasah Ibtidaiyah Diniyah Islamiyah diresmikan setelah dirintis dari ruang tamu rumahnya. Sekolah ini memadukan ilmu agama dan ilmu umum—sebuah gagasan yang belum lazim pada zamannya.",
    ],
    facts: [
      "Nama kecil KH Ahmad Dahlan: Muhammad Darwis",
      "Madrasah diresmikan 1 Desember 1911",
      "Berawal dari ruang tamu berukuran 2,5 × 6 meter",
    ],
    sources: [
      { label: "Sejarah Berdirinya Muhammadiyah", url: "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/" },
      { label: "Sejarah Singkat Muhammadiyah", url: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/" },
    ],
    branch: "akar",
    verified: true,
  },
  {
    id: "tunas-1912",
    year: "1912",
    kicker: "Tunas",
    title: "Lahirnya Muhammadiyah",
    paragraphs: [
      "Pada 18 November 1912 M atau 8 Dzulhijjah 1330 H, Muhammadiyah didirikan di Kauman, Yogyakarta. Sembilan orang pengurus inti menyusun organisasi yang bertujuan menyebarkan pengajaran agama Islam dan memajukan pengetahuan anggotanya. Ahmad Dahlan menjadi ketua.",
      "Dua tahun kemudian, tepatnya 22 Agustus 1914, pemerintah Hindia-Belanda mengakui Muhammadiyah sebagai badan hukum melalui Besluit No. 81.",
    ],
    facts: [
      "18 November 1912 / 8 Dzulhijjah 1330 H",
      "Didirikan di Kauman, Yogyakarta",
      "Badan hukum 22 Agustus 1914, Besluit No. 81",
    ],
    sources: [
      { label: "Sejarah Singkat Muhammadiyah", url: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/" },
      { label: "Sejarah Berdirinya Muhammadiyah", url: "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/" },
    ],
    branch: "akar",
    verified: true,
  },
  {
    id: "batang-kepemimpinan",
    year: "1912–1953",
    kicker: "Batang",
    title: "Dari satu kiai ke satu gerakan",
    paragraphs: [
      "Kepemimpinan awal Muhammadiyah berjalan dari KH Ahmad Dahlan (1912–1923), KH Ibrahim (1923–1931), KH Hisyam (1931–1936), KH Mas Mansur (1936–1942), hingga Ki Bagus Hadikusuma (1942–1953).",
      "Dalam Kongres Budi Utomo 1917 di rumah Ahmad Dahlan, cita-cita Muhammadiyah diperluas: tidak hanya Yogyakarta, tetapi Jawa, Sumatera, Sulawesi, Kalimantan, dan berbagai tempat di nusantara.",
    ],
    facts: [
      "Lima pemimpin awal hingga 1953",
      "Kongres Budi Utomo 1917 di rumah Ahmad Dahlan",
      "Visi menjangkau seluruh nusantara",
    ],
    sources: [
      { label: "Sejarah Singkat Muhammadiyah", url: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/" },
    ],
    branch: "batang",
    verified: true,
  },
  {
    id: "cabang-amal-usaha",
    year: "1953–2026",
    kicker: "Cabang",
    title: "Amal usaha yang menaungi",
    paragraphs: [
      "Dari satu madrasah, Muhammadiyah menumbuhkan cabang-cabang amal usaha: pendidikan, kesehatan, sosial, dan pemberdayaan. Amal usaha adalah cara Muhammadiyah menghadirkan manfaat konkret di tengah masyarakat.",
      "Setiap cabang adalah cara menghadirkan manfaat: mendidik, merawat, menolong, dan memberdayakan. Halaman ini memilih menampilkan arah gerak dan sumber resmi, bukan angka yang belum seragam.",
    ],
    facts: [
      "Pendidikan, kesehatan, sosial, pemberdayaan",
      "Fokus pada manfaat, bukan angka",
    ],
    sources: [
      { label: "Profil Muhammadiyah", url: "https://muhammadiyah.or.id/profil/" },
    ],
    branch: "batang",
    verified: true,
  },
  {
    id: "kanopi-palu",
    year: "2026",
    kicker: "Kanopi",
    title: "Palu, kelor, dan ketangguhan",
    paragraphs: [
      "Palu, Sulawesi Tengah, menjadi tuan rumah Tanwir dan Milad ke-114. Universitas Muhammadiyah Palu dan amal usaha lain menjadi bagian dari denyut persyarikatan di kota ini.",
      "Sebagai bagian dari rangkaian, 114 pohon kelor ditanam di Palu. Kelor—tumbuhan yang kuat, sederhana, dan bermanfaat—menjadi metafora perjalanan 114 tahun Muhammadiyah.",
    ],
    facts: [
      "Tuan rumah: Palu, Sulawesi Tengah",
      "114 pohon kelor ditanam",
      "Kelor: kuat, sederhana, bermanfaat",
    ],
    sources: [
      { label: "Muhammadiyah Tanam 114 Pohon Kelor di Palu", url: "https://muhammadiyah.or.id/2026/10/sambut-tanwir-dan-milad-ke-114-muhammadiyah-tanam-114-pohon-kelor-di-palu/" },
      { label: "Makna di Balik Logo", url: "https://muhammadiyah.or.id/2026/09/makna-di-balik-logo-tanwir-dan-milad-ke-114-muhammadiyah/" },
    ],
    branch: "kanopi",
    verified: true,
  },
  {
    id: "buah-2027",
    year: "2026–2027",
    kicker: "Buah",
    title: "Bersama satukan bangsa",
    paragraphs: [
      "Tanwir dan Milad ke-114 berlangsung di Palu pada 19–21 November 2026; Milad historis diperingati 18 November 2026. Tema “Bersama Satukan Bangsa” mengajak kebersamaan yang diarahkan pada keadilan, kemakmuran, kesejahteraan, moralitas, ilmu, dan teknologi.",
      "Tanwir menyusun program Muhammadiyah untuk 25 tahun ke depan dan menjadi forum evaluasi menuju Muktamar ke-49 di Medan pada 2027.",
    ],
    facts: [
      "Tanwir & Milad: 19–21 November 2026",
      "Milad: 18 November 2026",
      "Muktamar ke-49: Medan, 2027",
    ],
    sources: [
      { label: "Program 25 Tahun Muhammadiyah", url: "https://muhammadiyah.or.id/2026/09/tanwir-di-palu-akan-susun-program-muhammadiyah-untuk-25-tahun-mendatang/" },
      { label: "Persiapan Muktamar 2027", url: "https://muhammadiyah.or.id/2026/09/tanwir-muhammadiyah-jadi-forum-evaluasi-dan-persiapan-muktamar-2027/" },
    ],
    branch: "kanopi",
    verified: true,
  },
];
