// ============================================================
// THEME CONFIG
// ============================================================
export const theme = {
  colors: {
    primary: '#1E3A8A',
    secondary: '#FBBF24',
    bg: '#F8FAFC',
    adminBg: '#111827',
    adminSidebar: '#0F172A',
  },
  school: {
    name: 'SMA Negeri 1 Nusantara',
    shortName: 'SMAN 1 Nusantara',
    tagline: 'Unggul dalam Ilmu, Mulia dalam Akhlak',
    address: 'Jl. Pendidikan No. 1, Jakarta Selatan, DKI Jakarta 12345',
    phone: '(021) 7890-1234',
    email: 'info@sman1nusantara.sch.id',
    website: 'www.sman1nusantara.sch.id',
    founded: '1965',
  },
}

// ============================================================
// DUMMY DATA
// ============================================================

export interface Berita {
  id: string
  slug: string
  judul: string
  ringkasan: string
  konten: string
  tanggal: string
  author: string
  thumbnail: string
  status: 'publish' | 'draft'
  kategori: string
}

export interface Kegiatan {
  id: string
  judul: string
  deskripsi: string
  tanggal: string
  lokasi: string
  thumbnail: string
}

export interface Guru {
  id: string
  nama: string
  jabatan: string
  mapel: string
  foto: string
  urutan: number
}

export const beritaList: Berita[] = [
  {
    id: '1',
    slug: 'siswa-raih-juara-olimpiade-nasional',
    judul: 'Siswa SMAN 1 Nusantara Raih Juara 1 Olimpiade Sains Nasional',
    ringkasan: 'Kebanggaan bagi seluruh civitas akademika SMAN 1 Nusantara, seorang siswa kelas XI berhasil meraih juara pertama pada ajang Olimpiade Sains Nasional bidang Fisika tahun ini.',
    konten: `<p>Kebanggaan bagi seluruh civitas akademika SMAN 1 Nusantara. Seorang siswa kelas XI Ilmu Pengetahuan Alam (IPA), Rizky Aditya Pratama, berhasil meraih juara pertama pada ajang bergengsi Olimpiade Sains Nasional (OSN) bidang Fisika yang diselenggarakan di Bandung, Jawa Barat.</p>
<p>Prestasi luar biasa ini tentu tidak datang begitu saja. Rizky telah menjalani serangkaian pelatihan intensif selama lebih dari enam bulan di bawah bimbingan Bapak Dr. Hendra Setiawan, guru Fisika berpengalaman yang juga merupakan lulusan Institut Teknologi Bandung.</p>
<p>"Saya sangat senang dan bersyukur atas pencapaian ini. Ini bukan hanya kemenangan saya pribadi, tapi juga kemenangan seluruh keluarga besar SMAN 1 Nusantara," ujar Rizky saat diwawancarai tim redaksi sekolah.</p>
<p>Kepala Sekolah SMAN 1 Nusantara, Drs. Ahmad Fauzi, M.Pd., menyampaikan rasa bangga dan apresiasinya kepada seluruh pihak yang telah mendukung pencapaian ini. "Ini adalah buah dari kerja keras, dedikasi, dan sinergi antara siswa, guru, orang tua, dan seluruh civitas akademika," tuturnya.</p>`,
    tanggal: '2024-03-15',
    author: 'Tim Redaksi',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    status: 'publish',
    kategori: 'Prestasi',
  },
  {
    id: '2',
    slug: 'penerimaan-peserta-didik-baru-2024',
    judul: 'Penerimaan Peserta Didik Baru Tahun Ajaran 2024/2025 Resmi Dibuka',
    ringkasan: 'SMAN 1 Nusantara membuka pendaftaran Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2024/2025. Proses pendaftaran dilakukan secara online melalui website resmi sekolah.',
    konten: `<p>SMAN 1 Nusantara dengan bangga mengumumkan pembukaan Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2024/2025. Pendaftaran dapat dilakukan secara online melalui website resmi sekolah mulai tanggal 1 Juni hingga 30 Juni 2024.</p>
<p>Proses PPDB tahun ini menggunakan sistem zonasi sesuai peraturan pemerintah, dengan beberapa jalur penerimaan yang tersedia, antara lain jalur zonasi, jalur prestasi, jalur afirmasi, dan jalur perpindahan orang tua.</p>
<p>Calon peserta didik diharapkan mempersiapkan dokumen-dokumen yang diperlukan, termasuk kartu keluarga, akta kelahiran, dan ijazah atau surat keterangan lulus dari sekolah asal.</p>`,
    tanggal: '2024-05-20',
    author: 'Humas Sekolah',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    status: 'publish',
    kategori: 'Pengumuman',
  },
  {
    id: '3',
    slug: 'kegiatan-class-meeting-semester-ganjil',
    judul: 'Class Meeting Semester Ganjil Berlangsung Meriah dan Penuh Semangat',
    ringkasan: 'Menutup semester ganjil tahun ajaran 2023/2024, SMAN 1 Nusantara menggelar class meeting selama lima hari yang diikuti oleh seluruh siswa dari kelas X hingga XII.',
    konten: `<p>Menutup semester ganjil tahun ajaran 2023/2024, SMAN 1 Nusantara menggelar rangkaian kegiatan class meeting yang berlangsung selama lima hari penuh semangat dan kebersamaan.</p>
<p>Berbagai lomba menarik dipertandingkan, mulai dari olahraga seperti futsal, voli, dan badminton, hingga lomba seni seperti vocal group, tari tradisional, dan poster digital. Antusias siswa terlihat sangat tinggi sepanjang acara berlangsung.</p>
<p>Ketua OSIS, Salsabila Rahmawati, menyatakan bahwa kegiatan ini merupakan ajang mempererat tali persaudaraan antar siswa sekaligus menyalurkan bakat dan minat di luar akademis.</p>`,
    tanggal: '2023-12-18',
    author: 'Tim Redaksi',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    status: 'publish',
    kategori: 'Kegiatan',
  },
  {
    id: '4',
    slug: 'workshop-digital-literacy-2024',
    judul: 'Workshop Literasi Digital untuk Siswa: Bijak Bermedia Sosial',
    ringkasan: 'Dalam rangka meningkatkan kesadaran siswa terhadap penggunaan media sosial yang bertanggung jawab, SMAN 1 Nusantara menggelar workshop literasi digital.',
    konten: `<p>SMAN 1 Nusantara menggelar workshop bertema "Bijak Bermedia Sosial di Era Digital" yang diikuti oleh seluruh siswa kelas X dan XI. Kegiatan ini menghadirkan narasumber dari Kominfo dan praktisi media digital.</p>`,
    tanggal: '2024-02-10',
    author: 'Humas Sekolah',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    status: 'publish',
    kategori: 'Workshop',
  },
  {
    id: '5',
    slug: 'pengumuman-jadwal-ujian-akhir-semester',
    judul: 'Jadwal Ujian Akhir Semester Genap 2023/2024 Telah Ditetapkan',
    ringkasan: 'Sesuai kalender akademik, SMAN 1 Nusantara telah menetapkan jadwal Ujian Akhir Semester (UAS) Genap tahun ajaran 2023/2024.',
    konten: `<p>Sesuai kalender akademik yang telah ditetapkan, SMAN 1 Nusantara mengumumkan jadwal resmi Ujian Akhir Semester (UAS) Genap tahun ajaran 2023/2024. UAS akan dilaksanakan mulai tanggal 3 hingga 14 Juni 2024.</p>`,
    tanggal: '2024-05-15',
    author: 'Tata Usaha',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80',
    status: 'draft',
    kategori: 'Pengumuman',
  },
  {
    id: '6',
    slug: 'ekstrakurikuler-robotik-juara-regional',
    judul: 'Tim Robotik SMAN 1 Nusantara Juara 2 Kompetisi Robot Regional',
    ringkasan: 'Tim ekstrakurikuler robotik SMAN 1 Nusantara berhasil meraih juara kedua dalam Kompetisi Robot Tingkat Regional se-DKI Jakarta dan Jawa Barat.',
    konten: `<p>Tim ekstrakurikuler robotik SMAN 1 Nusantara kembali mengharumkan nama sekolah dengan meraih posisi runner-up dalam Kompetisi Robot Tingkat Regional yang diikuti oleh 45 tim dari berbagai sekolah di DKI Jakarta dan Jawa Barat.</p>`,
    tanggal: '2024-03-28',
    author: 'Tim Redaksi',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    status: 'publish',
    kategori: 'Prestasi',
  },
]

export const kegiatanList: Kegiatan[] = [
  {
    id: '1',
    judul: 'Masa Orientasi Siswa Baru 2024',
    deskripsi: 'Program pengenalan lingkungan sekolah bagi siswa baru kelas X tahun ajaran 2024/2025.',
    tanggal: '2024-07-15',
    lokasi: 'Aula SMAN 1 Nusantara',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
  {
    id: '2',
    judul: 'Peringatan HUT RI ke-79',
    deskripsi: 'Upacara bendera dan berbagai lomba dalam rangka memperingati hari kemerdekaan Indonesia.',
    tanggal: '2024-08-17',
    lokasi: 'Lapangan SMAN 1 Nusantara',
    thumbnail: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&q=80',
  },
  {
    id: '3',
    judul: 'Study Tour Ke Yogyakarta',
    deskripsi: 'Perjalanan edukatif kelas XI ke berbagai destinasi pendidikan dan budaya di Yogyakarta.',
    tanggal: '2024-09-10',
    lokasi: 'Yogyakarta, DIY',
    thumbnail: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
  },
  {
    id: '4',
    judul: 'Seminar Karier & Perguruan Tinggi',
    deskripsi: 'Seminar khusus kelas XII tentang persiapan masuk perguruan tinggi negeri dan swasta.',
    tanggal: '2024-10-05',
    lokasi: 'Aula SMAN 1 Nusantara',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  },
]

export const guruList: Guru[] = [
  {
    id: '1',
    nama: 'Drs. Ahmad Fauzi, M.Pd.',
    jabatan: 'Kepala Sekolah',
    mapel: '-',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    urutan: 1,
  },
  {
    id: '2',
    nama: 'Dr. Hendra Setiawan, M.Si.',
    jabatan: 'Wakil Kepala Bid. Kurikulum',
    mapel: 'Fisika',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    urutan: 2,
  },
  {
    id: '3',
    nama: 'Dra. Sri Wahyuni, M.Pd.',
    jabatan: 'Wakil Kepala Bid. Kesiswaan',
    mapel: 'Bahasa Indonesia',
    foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    urutan: 3,
  },
  {
    id: '4',
    nama: 'Budi Santoso, S.Pd.',
    jabatan: 'Guru Senior',
    mapel: 'Matematika',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    urutan: 4,
  },
  {
    id: '5',
    nama: 'Rina Kusumawati, S.Pd.',
    jabatan: 'Guru Senior',
    mapel: 'Kimia',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    urutan: 5,
  },
  {
    id: '6',
    nama: 'Agus Purnomo, S.Kom.',
    jabatan: 'Guru',
    mapel: 'Informatika',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    urutan: 6,
  },
  {
    id: '7',
    nama: 'Dewi Rahayu, S.Pd., M.Hum.',
    jabatan: 'Guru',
    mapel: 'Bahasa Inggris',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    urutan: 7,
  },
  {
    id: '8',
    nama: 'Hasan Basri, S.Pd.',
    jabatan: 'Guru',
    mapel: 'Sejarah',
    foto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
    urutan: 8,
  },
]

export const statsData = [
  { label: 'Siswa Aktif', value: '1.248', icon: 'Users', color: 'bg-blue-50 text-blue-600' },
  { label: 'Tenaga Pendidik', value: '68', icon: 'GraduationCap', color: 'bg-amber-50 text-amber-600' },
  { label: 'Prestasi Diraih', value: '320+', icon: 'Trophy', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Tahun Berdiri', value: '1965', icon: 'Building', color: 'bg-purple-50 text-purple-600' },
]

export const adminStats = [
  { label: 'Total Berita', value: '47', change: '+3 bulan ini', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Guru', value: '68', change: '+2 baru', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Kegiatan', value: '24', change: '+1 minggu ini', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Total Pengunjung', value: '12.4K', change: '+18% bulan ini', color: 'text-purple-600', bg: 'bg-purple-50' },
]
