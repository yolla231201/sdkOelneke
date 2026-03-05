# 🏫 Website Sekolah + Admin CMS

Website resmi sekolah modern + Admin Panel CMS dibangun dengan **Next.js 14 App Router**, **TypeScript**, dan **Tailwind CSS**.

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Folder

```
app/
├── (public)/           # Public website
│   ├── page.tsx        # Home page
│   ├── berita/         # Daftar & detail berita
│   ├── kegiatan/       # Kegiatan sekolah
│   ├── guru/           # Daftar guru
│   ├── profil/         # Profil sekolah
│   └── kontak/         # Kontak & form
│
├── admin/              # Admin CMS Panel
│   ├── dashboard/      # Dashboard statistik
│   ├── berita/         # CRUD berita
│   ├── kegiatan/       # Kelola kegiatan
│   ├── guru/           # Kelola data guru
│   └── profil/         # Edit profil sekolah
│
└── login/              # Halaman login

components/
├── ui/                 # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   └── SectionTitle.tsx
├── public/
│   ├── Navbar.tsx
│   └── Footer.tsx
└── admin/
    └── AdminSidebar.tsx

lib/
└── data.ts             # Dummy data & theme config
```

---

## 🎨 Design System

| Elemen | Value |
|--------|-------|
| Primary Color | `#1E3A8A` (Biru Sekolah) |
| Secondary Color | `#FBBF24` (Kuning Emas) |
| Background | `#F8FAFC` |
| Admin BG | `#111827` |
| Font Display | Poppins |
| Font Body | Plus Jakarta Sans |
| Border Radius | `rounded-2xl` |

---

## 📄 Halaman

### Public Website
| Route | Halaman |
|-------|---------|
| `/` | Home - Hero, Statistik, Berita, Kegiatan, Guru |
| `/berita` | Daftar Berita (grid responsive) |
| `/berita/[slug]` | Detail Berita |
| `/kegiatan` | Kegiatan Sekolah |
| `/guru` | Daftar Guru |
| `/profil` | Profil, Visi, Misi, Sejarah |
| `/kontak` | Form Kontak |

### Admin Panel
| Route | Halaman |
|-------|---------|
| `/login` | Halaman Login |
| `/admin/dashboard` | Dashboard Statistik |
| `/admin/berita` | Tabel Berita + Badge Status |
| `/admin/berita/create` | Form Buat Berita Baru |
| `/admin/berita/edit/[id]` | Form Edit Berita |
| `/admin/kegiatan` | Kelola Kegiatan |
| `/admin/guru` | Kelola Data Guru |
| `/admin/profil` | Edit Profil & Identitas Sekolah |

---

## 🔧 Integrasi API (Next Steps)

Untuk integrasi backend, tambahkan route handlers di:
- `app/api/berita/route.ts`
- `app/api/guru/route.ts`
- `app/api/kegiatan/route.ts`
- `app/api/auth/[...nextauth]/route.ts`

Ganti dummy data di `lib/data.ts` dengan fetch ke API Anda.

---

## 📦 Dependencies Utama

- `next@14` - App Router
- `react@18`
- `typescript`
- `tailwindcss@3`
- `lucide-react` - Icon library
- `clsx` - Conditional className

---

> **Note:** Ini adalah UI-only project. Tidak ada backend logic, database, atau authentication yang sebenarnya.
