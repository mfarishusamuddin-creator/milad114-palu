export type SourceRef = {
  label: string;
  url: string;
};

export type HistoryEntry = {
  id: string;
  year: string;
  kicker: string;
  title: string;
  paragraphs: string[];
  facts?: string[];
};

export type HistoryTrack = {
  id: "muhammadiyah" | "dahlan";
  label: string;
  description: string;
  entries: HistoryEntry[];
};

export type HistoryTable = {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type HistoryContent = {
  tabsLabel: string;
  tracks: HistoryTrack[];
  tables: HistoryTable[];
  sources: SourceRef[];
};

export const historyId: HistoryContent = {
  tabsLabel: "Pilih jalur sejarah",
  tracks: [
    {
      id: "muhammadiyah",
      label: "Muhammadiyah",
      description:
        "Kronologi Persyarikatan: dari deklarasi Kauman hingga abad kedua Islam Berkemajuan.",
      entries: [
        {
          id: "kauman-1912",
          year: "1912",
          kicker: "Pendirian",
          title: "Deklarasi Kauman",
          paragraphs: [
            "Pada 18 November 1912 M / 8 Dzulhijjah 1330 H, Muhammadiyah didirikan di Kampung Kauman, Yogyakarta. Sembilan orang pengurus inti melembagakan gerakan yang bertujuan menyebarkan pengajaran agama Islam dan memajukan pengetahuan umat.",
            "Nama Muhammadiyah diambil dari nama Nabi Muhammad SAW ditambah ya nisbiyah — maknanya, pengikut Nabi Muhammad SAW.",
          ],
          facts: [
            "Didirikan di Kauman, Yogyakarta",
            "Ketua pertama: KH Ahmad Dahlan",
            "Sekretaris: Abdullah Sirat",
          ],
        },
        {
          id: "badan-hukum-1914",
          year: "1914",
          kicker: "Legalitas",
          title: "Badan hukum dari pemerintah kolonial",
          paragraphs: [
            "Pemerintah Hindia Belanda mengakui Muhammadiyah sebagai badan hukum melalui Gouvernements Besluit No. 81 pada 22 Agustus 1914 — dengan pembatasan wilayah hanya di Karesidenan Yogyakarta.",
            "KH Ahmad Dahlan menyiasatinya dengan merangkai organisasi lokal berjejaring di luar Yogyakarta, seperti Sidik Amanat Tablig Subhan di Surakarta dan Nurul Islam di Pekalongan. Pembatasan dicabut pada 1921, saat izin operasional nasional diberikan.",
          ],
          facts: [
            "Besluit No. 81, 22 Agustus 1914",
            "Pembatasan wilayah dicabut 1921",
            "Jejaring: Sidik Amanat Tablig Subhan, Nurul Islam",
          ],
        },
        {
          id: "aisyiyah-1917",
          year: "1917",
          kicker: "Emansipasi",
          title: "‘Aisyiyah: peran perempuan",
          paragraphs: [
            "Bersama Nyai Ahmad Dahlan, KH Ahmad Dahlan merintis ‘Aisyiyah — organisasi perempuan Muslim yang membuka hak pendidikan dan peran publik bagi perempuan.",
            "Sekolah kuliah dan pendidikan dini usia ‘Aisyiyah menghadirkan akses belajar bagi perempuan dan anak, jauh sebelum isu ini menjadi perhatian umum.",
          ],
          facts: [
            "Pelopor kebangkitan perempuan Muslim",
            "Pendidikan dini usia dan sekolah kuliah",
          ],
        },
        {
          id: "konsolidasi-1923-1953",
          year: "1923–1953",
          kicker: "Konsolidasi",
          title: "Empat kepemimpinan, satu fondasi",
          paragraphs: [
            "Setelah wafatnya pendiri, kepemimpinan dilanjutkan KH Ibrahim (1923–1932), KH Hisyam (1932–1936), KH Mas Mansur (1936–1942), hingga Ki Bagus Hadikusumo (1942–1953).",
            "Pada masa ini struktur organisasi dilembagakan, cabang meluas ke luar Jawa, sistem administrasi sekolah distandarkan, dan “Langkah Tiga Belas” Mas Mansur mengonsolidasikan politik keislaman.",
          ],
          facts: [
            "Pelembagaan struktur organisasi",
            "Perluasan cabang ke luar Jawa",
          ],
        },
        {
          id: "seikerei-1942-1945",
          year: "1942–1945",
          kicker: "Keteguhan",
          title: "Menolak Seikerei",
          paragraphs: [
            "Di bawah pendudukan Jepang, Muhammadiyah dipaksa mengikuti Seikerei — persembahan bungkuk ke arah Tokyo. Ki Bagus Hadikusumo dan jajaran Persyarikatan menolak keras: membungkuk kepada selain Allah bertentangan dengan tauhid.",
            "Muhammadiyah tetap menjalankan dakwah, pendidikan, dan layanan sosial di tengah tekanan pendudukan.",
          ],
          facts: [
            "Seikerei ditolak karena bertentangan dengan tauhid",
            "Dakwah dan layanan sosial tetap berjalan",
          ],
        },
        {
          id: "kenegaraan-1945",
          year: "1945",
          kicker: "Kenegaraan",
          title: "18 Agustus 1945 dan Piagam Jakarta",
          paragraphs: [
            "Pada 18 Agustus 1945, Ki Bagus Hadikusumo — anggota Panitia Sembilan — menyetujui penghapusan tujuh kata dalam Piagam Jakarta demi keutuhan NKRI.",
            "Muhammadiyah merumuskan Sila Pertama Pancasila sebagai “Ketuhanan Yang Maha Esa” dan berikrar menegakkan agama serta negara Indonesia.",
          ],
          facts: [
            "Anggota Panitia Sembilan perumus Piagam Jakarta",
            "Sila Pertama: Ketuhanan Yang Maha Esa",
          ],
        },
        {
          id: "khittah-1956",
          year: "1956",
          kicker: "Khittah",
          title: "Khittah Palembang",
          paragraphs: [
            "Muktamar Palembang 1956 menegaskan garis perjuangan Muhammadiyah: bergerak melalui amar ma’ruf nahi munkar tanpa praktik politik partai, mengikuti jejak perjuangan pendiri.",
            "Khittah ini menjadi kompas yang menjaga Muhammadiyah sebagai gerakan Islam dan kebangsaan yang mandiri.",
          ],
          facts: ["Muktamar Palembang 1956", "Netralitas aktif, politik adiluhung"],
        },
        {
          id: "matan-1959-1968",
          year: "1959–1968",
          kicker: "Ideologi",
          title: "Matan Kepribadian Muhammadiyah",
          paragraphs: [
            "Era KH Ahmad Badawi dan KH Faqih Usman merumuskan Matan Kepribadian Muhammadiyah — rumusan kader yang menegaskan hidup berdasar tauhid dan bermasyarakat, pasca-turbulensi politik 1965.",
            "Mukaddimah Anggaran Dasar juga diperkuat menjadi payung ideologi gerakan.",
          ],
          facts: ["Rumusan kader pasca-1965", "Tauhid sebagai jangkar kehidupan"],
        },
        {
          id: "khittah-perjuangan-1956-2002",
          year: "1956–2002",
          kicker: "Kebangsaan",
          title: "Garis khittah yang berkelanjutan",
          paragraphs: [
            "Khittah Palembang (1956) disusul Ponorogo (1969), Ujung Pandang (1971), hingga Denpasar (2002) — semuanya menegaskan netralitas aktif dan politik adiluhung.",
            "Muhammadiyah memposisikan diri sebagai perekat kebangsaan: non-politik praktis, tetapi hadir dalam setiap persoalan umat dan bangsa.",
          ],
          facts: [
            "Ponorogo 1969 · Ujung Pandang 1971 · Denpasar 2002",
            "Darul Ahdi wa Syahadah",
          ],
        },
        {
          id: "maarif-1998-2005",
          year: "1998–2005",
          kicker: "Kepemimpinan",
          title: "Era Syafii Maarif",
          paragraphs: [
            "Prof. Dr. A. Syafii Maarif memimpin Muhammadiyah melewati transisi Reformasi dengan menguatkan kebangsaan, kemanusiaan inklusif, dan kearifan kebudayaan.",
            "Suara Muhammadiyah menjadi rujukan moral dalam pergolakan politik nasional.",
          ],
          facts: ["Penguatan kebangsaan", "Kemanusiaan inklusif"],
        },
        {
          id: "din-2005-2015",
          year: "2005–2015",
          kicker: "Diplomasi",
          title: "Era Din Syamsuddin",
          paragraphs: [
            "Prof. Dr. Din Syamsuddin mendorong rebranding Islam Berkemajuan dan mempercepat diplomasi perdamaian global — dari forum antaragama hingga kerja kemanusiaan lintas negara.",
            "Jejaring internasional Muhammadiyah melebar pesat pada dekade ini.",
          ],
          facts: ["Diplomasi perdamaian global", "Rebranding Islam Berkemajuan"],
        },
        {
          id: "risalah-2022",
          year: "2022",
          kicker: "Abad kedua",
          title: "Risalah Islam Berkemajuan",
          paragraphs: [
            "Muktamar ke-48 di Surakarta mengesahkan Risalah Islam Berkemajuan — kompas ideologi gerakan di abad kedua, di bawah kepemimpinan Prof. Dr. Haedar Nashir.",
            "Risalah memuat lima karakteristik: tauhid murni; pemaknaan Al-Qur’an dan Sunnah berbasis ijtihad; tajdid berkelanjutan; wasathiyah; dan Islam sebagai rahmatan lil ‘alamin.",
          ],
          facts: ["Muktamar ke-48, Surakarta", "Lima karakteristik Islam Berkemajuan"],
        },
        {
          id: "internasionalisasi",
          year: "Abad kedua",
          kicker: "Global",
          title: "Internasionalisasi gerakan",
          paragraphs: [
            "Jaringan Pimpinan Cabang Istimewa Muhammadiyah (PCIM) kini tersebar di 29 negara — dari Timur Tengah hingga Australia, Eropa, Amerika, dan Asia.",
            "Amal Usaha Muhammadiyah Luar Negeri melahirkan institusi seperti Muhammadiyah Australia College (MAC) di Victoria dan Universiti Muhammadiyah Malaysia (UMAM) di Perlis.",
          ],
          facts: ["29 PCIM di lima kawasan", "MAC Victoria · UMAM Perlis"],
        },
        {
          id: "nashir-2015",
          year: "2015–kini",
          kicker: "Kepemimpinan",
          title: "Era Haedar Nashir",
          paragraphs: [
            "Prof. Dr. Haedar Nashir memimpin Persyarikatan dengan fokus penguatan kelembagaan, pendidikan, dan kesejahteraan umat — hingga pengesahan Risalah Islam Berkemajuan dan perluasan AUM luar negeri.",
            "Di bawah kepemimpinannya, Muhammadiyah meneguhkan diri sebagai gerakan pembaharuan yang moderat, maju, dan berkebangsaan.",
          ],
          facts: [
            "Pengesahan Risalah Islam Berkemajuan",
            "Pendirian AUM Luar Negeri",
          ],
        },
        {
          id: "milad-114-2026",
          year: "2026",
          kicker: "Palu 2026",
          title: "Milad ke-114 dan Tanwir Palu",
          paragraphs: [
            "Tanwir dan Milad ke-114 digelar di Palu, 19–21 November 2026 M / 10–12 Jumadilakhir 1448 H — perhelatan nasional yang menghormati resiliensi Sulawesi Tengah pascabencana 2018.",
            "Agenda utamanya: pengesahan Program Strategis 25 Tahun (2025–2050) dan konsolidasi menuju Muktamar ke-49 di Medan 2027.",
          ],
          facts: [
            "Palu, 19–21 November 2026",
            "Program Strategis 25 Tahun (2025–2050)",
            "Menuju Muktamar ke-49 Medan 2027",
          ],
        },
      ],
    },
    {
      id: "dahlan",
      label: "KH Ahmad Dahlan",
      description:
        "Perjalanan hidup pendiri: dari Kauman 1868 hingga Pahlawan Nasional.",
      entries: [
        {
          id: "kelahiran-1868",
          year: "1868",
          kicker: "Kauman",
          title: "Kelahiran Muhammad Darwis",
          paragraphs: [
            "Lahir pada 1 Agustus 1868 di Kampung Kauman, Yogyakarta, dengan nama Muhammad Darwis — putra KH Abu Bakar, Khatib Masjid Gedhe Kesultanan Yogyakarta, dan Siti Aminah, putri Penghulu Ageng.",
            "Ia tumbuh di lingkungan masjid dan pesantren; pada usia 8 tahun sudah fasih membaca Al-Qur’an.",
          ],
          facts: [
            "1 Agustus 1868, Kampung Kauman",
            "Lingkungan ulama Kesultanan Yogyakarta",
          ],
        },
        {
          id: "haji-pertama-1883",
          year: "1883",
          kicker: "Makkah",
          title: "Rihlah haji pertama",
          paragraphs: [
            "Di usia 15 tahun, Muhammad Darwis berangkat haji ke Makkah dan berguru selama satu tahun kepada Sayyid Bakri Syatha.",
            "Gurunya memberinya nama baru: Ahmad Dahlan — nama yang kelak melekat sepanjang sejarah.",
          ],
          facts: ["Guru: Sayyid Bakri Syatha", "Nama baru: Ahmad Dahlan"],
        },
        {
          id: "khatib-amin-1890",
          year: "1890",
          kicker: "Legitimasi",
          title: "Khatib Amin Masjid Gedhe",
          paragraphs: [
            "Ahmad Dahlan diangkat menjadi Khatib Amin di Masjid Gedhe Kesultanan Yogyakarta.",
            "Legitimasi sosial-keagamaan resmi dari Keraton menempatkannya di jantung kehidupan keislaman Yogyakarta.",
          ],
          facts: [
            "Legitimasi dari Kesultanan Yogyakarta",
            "Minbar Masjid Gedhe Kauman",
          ],
        },
        {
          id: "kiblat-1896-1898",
          year: "1896–1898",
          kicker: "Pembaharuan",
          title: "Koreksi kiblat 24 derajat",
          paragraphs: [
            "Dengan ilmu hisab/falak dan kompas astronomi — dikoreksi melalui observasi di Observatorium Lembang — Dahlan membuktikan arah kiblat Masjid Gedhe bergeser 24 derajat ke timur laut.",
            "Gagasan ini ditentang ulama tradisionalis; surau pribadinya dibongkar. Pelajarannya jelas: pembaharuan membutuhkan wadah organisasi modern.",
          ],
          facts: [
            "Kiblat bergeser 24° ke timur laut",
            "Surau pribadi dibongkar",
            "Observatorium Lembang sebagai pembanding",
          ],
        },
        {
          id: "rihlah-1903",
          year: "1903",
          kicker: "Makkah",
          title: "Rihlah ilmiah kedua",
          paragraphs: [
            "Dahlan bermukim dua tahun di Makkah, berguru kepada Syeikh Ahmad Khatib Al-Minangkabawi dan berdiskusi dengan ulama Nusantara — Kiai Nawawi Al-Bantani, Kiai Mas Abdullah, Kiai Faqih Kembang.",
            "Dari sini ia menyerap ide pembaharuan: Ibnu Taimiyah (purifikasi akidah), Al-Afghani (keumatan), Abduh (reformasi pendidikan), dan Rasyid Ridha (hukum Islam adaptif).",
          ],
          facts: [
            "Guru: Ahmad Khatib Al-Minangkabawi",
            "Sintesis empat pemikir pembaru",
          ],
        },
        {
          id: "sintesis-1883-1911",
          year: "1883–1911",
          kicker: "Pemikiran",
          title: "Sintesis pemikiran pembaru",
          paragraphs: [
            "Sepanjang periode ini Dahlan merangkai sintesis: purifikasi akidah dari Ibnu Taimiyah, pan-Islamisme Al-Afghani, rasionalisme pendidikan Abduh, dan pembaharuan hukum Rasyid Ridha lewat Majalah Al-Manar.",
            "Sintesis ini menjadi fondasi intelektual gerakan yang kelak ia dirikan.",
          ],
          facts: [
            "Ibnu Taimiyah · Al-Afghani · Abduh · Ridha",
            "Fondasi intelektual Muhammadiyah",
          ],
        },
        {
          id: "budi-utomo-1909",
          year: "1909",
          kicker: "Organisasi",
          title: "Bergabung dengan Budi Utomo",
          paragraphs: [
            "Dahlan mengajar agama Islam bagi siswa pamong praja dan bergabung dengan Budi Utomo — mempelajari tata kelola organisasi modern.",
            "Atas masukan tokoh Budi Utomo (Mas Rasyidi dan R. Sosrosugondo), ia terdorong mendirikan lembaga pendidikan permanen — dan kemudian, organisasi pergerakan.",
          ],
          facts: [
            "Mengajar siswa Kweekschool",
            "Belajar tata kelola organisasi modern",
          ],
        },
        {
          id: "madrasah-1911",
          year: "1911",
          kicker: "Pendidikan",
          title: "Madrasah Ibtidaiyah Diniyah Islamiyah",
          paragraphs: [
            "Diresmikan pada 1 Desember 1911 di serambi rumah Dahlan — ruang berukuran 2,5 × 6 meter.",
            "Meja, kursi, dan papan tulis menggantikan duduk bersila; kurikulum memadukan ilmu agama dengan ilmu umum seperti ilmu hitung, bumi, dan hayat — integrasi yang belum lazim pada zamannya.",
          ],
          facts: [
            "Diresmikan 1 Desember 1911",
            "Serambi rumah 2,5 × 6 m",
            "Kurikulum integratif agama–ilmu umum",
          ],
        },
        {
          id: "pendirian-1912",
          year: "1912",
          kicker: "Pendirian",
          title: "Mendirikan Muhammadiyah",
          paragraphs: [
            "Pada 18 November 1912, gagasan Dahlan melembaga menjadi Muhammadiyah — organisasi pembaharuan yang menggabungkan purifikasi keagamaan dengan instrumen organisasi modern.",
            "Ia menjadi ketua pertama, didampingi Abdullah Sirat sebagai sekretaris dan tujuh anggota pengurus inti.",
          ],
          facts: [
            "18 November 1912 / 8 Dzulhijjah 1330 H",
            "Ketua pertama Muhammadiyah",
          ],
        },
        {
          id: "maun-1912-1923",
          year: "1912–1923",
          kicker: "Teologi",
          title: "Teologi Al-Ma’un dan PKO",
          paragraphs: [
            "Dahlan mengajarkan Surah Al-Ma’un berulang-ulang hingga murid mengamalkannya: ibadah tanpa aksi bagi anak yatim dan orang miskin dianggap tidak bermakna.",
            "“Sedikit bicara, banyak bekerja” melahirkan Penolong Kesengsaraan Umum (PKO), rumah sakit, klinik, dan panti asuhan — transformasi ritual menjadi aksi sosial terorganisir.",
          ],
          facts: [
            "Sedikit bicara, banyak bekerja",
            "Cikal bakal PKO dan rumah sakit",
          ],
        },
        {
          id: "aisyiyah-1917",
          year: "1917",
          kicker: "Emansipasi",
          title: "Merintis ‘Aisyiyah",
          paragraphs: [
            "Bersama Nyai Ahmad Dahlan, ia merintis ‘Aisyiyah — pelopor kebangkitan dan kesetaraan peran sosial perempuan Muslim.",
            "Gerakan perempuan ini menjadi salah satu warisan terpenting Dahlan di luar pendidikan.",
          ],
          facts: ["Bersama Nyai Ahmad Dahlan", "Kesetaraan peran sosial perempuan"],
        },
        {
          id: "wafat-1923",
          year: "1923",
          kicker: "Perpisahan",
          title: "Wafat di Yogyakarta",
          paragraphs: [
            "KH Ahmad Dahlan wafat pada 23 Februari 1923 di Yogyakarta, dimakamkan di Karangkajen.",
            "Ia meninggalkan warisan organisasi modern, jaringan sekolah, dan generasi kader yang melanjutkan gerakan.",
          ],
          facts: ["23 Februari 1923", "Dimakamkan di Karangkajen"],
        },
        {
          id: "pahlawan-1961",
          year: "1961",
          kicker: "Pengakuan",
          title: "Pahlawan Nasional",
          paragraphs: [
            "Melalui SK Presiden No. 657/1961, pemerintah Indonesia menetapkan KH Ahmad Dahlan sebagai Pahlawan Nasional.",
            "Pengakuan negara atas kontribusi pembaruan sosial dan pendidikannya — serta jasa meletakkan dasar Islam Indonesia yang berkemajuan dan berkebangsaan.",
          ],
          facts: ["SK Presiden No. 657/1961", "Gelar Pahlawan Nasional"],
        },
      ],
    },
  ],
  tables: [
    {
      title: "Kepemimpinan Pimpinan Pusat Muhammadiyah",
      columns: ["Periode", "Ketua Umum", "Fokus utama era"],
      rows: [
        [
          "1912–1923",
          "KH Ahmad Dahlan",
          "Pondasi gerakan, pembaruan kurikulum, dan Teologi Al-Ma’un",
        ],
        [
          "1923–1932",
          "KH Ibrahim",
          "Pelembagaan struktur organisasi dan perluasan cabang luar Jawa",
        ],
        [
          "1932–1936",
          "KH Hisyam",
          "Penguatan administrasi sekolah dan standarisasi pendidikan",
        ],
        [
          "1936–1942",
          "KH Mas Mansur",
          "Formulasi “Langkah Tiga Belas” dan konsolidasi politik keislaman",
        ],
        [
          "1942–1953",
          "Ki Bagus Hadikusumo",
          "Penyelamatan ideologi era Jepang; perumusan Pancasila dan UUD 1945",
        ],
        [
          "1953–1959",
          "AR Sutan Mansur",
          "Khittah Palembang dan penataan kembali moralitas kader",
        ],
        [
          "1959–1968",
          "KH Ahmad Badawi & KH Faqih Usman",
          "Penyusunan Matan Kepribadian pasca-turbulensi politik 1965",
        ],
        [
          "1968–1990",
          "KH AR Fachruddin",
          "Kepemimpinan terpanjang; dakwah budaya dan stabilitas",
        ],
        [
          "1990–1995",
          "KH Azhar Basyir",
          "Penguatan pemikiran keislaman dan kajian Fiqh Tarjih",
        ],
        [
          "1995–1998",
          "Prof. Dr. Amien Rais",
          "Suksesi kepemimpinan nasional; pengawalan Reformasi 1998",
        ],
        [
          "1998–2005",
          "Prof. Dr. A. Syafii Maarif",
          "Kebangsaan, kemanusiaan inklusif, dan kearifan kebudayaan",
        ],
        [
          "2005–2015",
          "Prof. Dr. Din Syamsuddin",
          "Rebranding Islam Berkemajuan dan diplomasi perdamaian global",
        ],
        [
          "2015–kini",
          "Prof. Dr. Haedar Nashir",
          "Risalah Islam Berkemajuan, AUM Luar Negeri, dan asetasi modern",
        ],
      ],
    },
    {
      title: "Amal Usaha Muhammadiyah dalam angka",
      columns: ["Kategori", "Jumlah", "Cakupan"],
      note: "Data dokumen 2026; jumlah PCIM mengikuti halaman resmi Cabang Istimewa Muhammadiyah.",
      rows: [
        [
          "Pimpinan Wilayah (PWM)",
          "35",
          "Tingkat provinsi di seluruh Indonesia",
        ],
        ["Pimpinan Daerah (PDM)", "475", "Tingkat kabupaten/kota"],
        ["Pimpinan Cabang (PCM)", "3.947", "Tingkat kecamatan"],
        ["Pimpinan Ranting (PRM)", "14.670", "Tingkat desa/kelurahan"],
        [
          "Pimpinan Cabang Istimewa (PCIM)",
          "29",
          "Luar negeri — Asia, Australia, Eropa, Amerika, Afrika",
        ],
        [
          "Perguruan Tinggi Muhammadiyah-’Aisyiyah (PTMA)",
          "172",
          "83 universitas, 53 sekolah tinggi, 36 akademi/politeknik",
        ],
        [
          "Sekolah dasar & menengah",
          "5.345–6.000",
          "SD/MI, SMP/MTs, SMA/SMK/MA",
        ],
        ["TK / TPQ / PAUD ‘Aisyiyah", "> 4.600", "Pendidikan anak dini usia"],
        [
          "Pesantren (PesantrenMu)",
          "440",
          "Pesantren integratif kurikulum modern dan kitab",
        ],
        [
          "Rumah sakit (PKU Muhammadiyah-’Aisyiyah)",
          "122 (+20 proses)",
          "Jaringan kesehatan nasional",
        ],
        [
          "Klinik & balai pengobatan",
          "231",
          "Layanan kesehatan primer masyarakat",
        ],
        [
          "Amal usaha sosial (LKSA)",
          "1.012",
          "Panti asuhan, panti jompo, dan panti rehabilitasi",
        ],
        [
          "Aset tanah wakaf",
          "20.465 lokasi",
          "Total luas lebih dari 214 juta m²",
        ],
      ],
    },
  ],
  sources: [
    {
      label: "Sejarah Singkat Muhammadiyah",
      url: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/",
    },
    {
      label: "Sejarah Berdirinya Muhammadiyah",
      url: "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/",
    },
    {
      label: "Profil Muhammadiyah",
      url: "https://muhammadiyah.or.id/profil/",
    },
    {
      label: "Cabang Istimewa Muhammadiyah",
      url: "https://muhammadiyah.or.id/cabang-istimewa/",
    },
  ],
};
