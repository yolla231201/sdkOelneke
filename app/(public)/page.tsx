import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, Users, GraduationCap, Trophy,
  Building2, CalendarDays, ChevronRight
} from "lucide-react"
import Button from "@/components/ui/Button"
import SectionTitle from "@/components/ui/SectionTitle"
import { Card, CardContent } from "@/components/ui/Card"
import { prisma } from "@/lib/prisma"

// ─── Types ───────────────────────────────────────────────────────────────────

type Setting = {
  schoolName: string
  shortName: string | null
  tagline: string | null
  founded: string | null
  akreditasi: string | null
  siswaAktif: string | null
  prestasi: string | null
  logo: string | null
  heroImage: string | null
}

type Berita = {
  id: number
  judul: string
  slug: string
  deskripsi: string | null
  thumbnail: string | null
  createdAt: Date
  author: { name: string }
}

type Kegiatan = {
  id: number
  judul: string
  thumbnail: string | null
  tanggal: string
  lokasi: string
}

type Guru = {
  id: number
  nama: string
  jabatan: string | null
  foto: string | null
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

// Hapus fungsi getData yang lama, ganti dengan ini
async function getData() {
  const [setting, beritaList, kegiatanList, guruList] = await Promise.all([
    prisma.settings.findUnique({
      where: { id: 1 },
      select: {
        schoolName: true, shortName: true, tagline: true,
        founded: true, akreditasi: true, siswaAktif: true,
        prestasi: true, logo: true, heroImage: true,
      },
    }),
    prisma.berita.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true, judul: true, slug: true,
        deskripsi: true, thumbnail: true, createdAt: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.kegiatan.findMany({
      select: { id: true, judul: true, thumbnail: true, tanggal: true, lokasi: true },
      orderBy: { tanggal: "desc" },
      take: 4,
    }),
    prisma.guru.findMany({
      select: { id: true, nama: true, jabatan: true, foto: true },
      orderBy: { urutan: "asc" },
      take: 4,
    }),
  ])

  return {
    setting: setting ?? {
      schoolName: "Nama Sekolah", shortName: null, tagline: null,
      founded: null, akreditasi: null, siswaAktif: null,
      prestasi: null, logo: null, heroImage: null,
    },
    beritaList,
    kegiatanList,
    guruList,
  }
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { setting, beritaList, kegiatanList, guruList } = await getData()

  const stats = [
    { label: "Siswa Aktif", value: setting.siswaAktif ?? "–", icon: Users, color: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Tenaga Pendidik", value: String(guruList.length || "–"), icon: GraduationCap, color: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "Prestasi Diraih", value: setting.prestasi ?? "–", icon: Trophy, color: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Tahun Berdiri", value: setting.founded ?? "–", icon: Building2, color: "bg-purple-50", iconColor: "text-purple-600" },
  ]

  return (
    <div className="bg-[#F8FAFC]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1e40af] to-[#0f2560] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse" />
                Sekolah Unggulan Nasional
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Selamat Datang di
                <span className="block text-[#FBBF24]">
                  {setting.shortName ?? setting.schoolName}
                </span>
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                {setting.tagline}. Bergabunglah bersama lebih dari seribu siswa berprestasi dalam lingkungan belajar yang inspiratif.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/berita">
                  <Button size="lg" variant="secondary" className="group">
                    Lihat Berita
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/kontak">
                  <button className="px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300">
                    Daftar Sekarang
                  </button>
                </Link>
              </div>
            </div>

            {/* Visual Card */}
            <div className="hidden lg:block animate-fade-in animate-delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-900/40 rounded-3xl" />
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                  {setting.heroImage ? (
                    <Image
                      src={setting.heroImage}
                      alt="Sekolah"
                      width={600}
                      height={400}
                      className="w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-white/10 rounded-2xl" />
                  )}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Prestasi</p>
                      <p className="text-sm font-bold text-slate-800">
                        {setting.prestasi ?? "–"} Penghargaan
                      </p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-[#FBBF24] rounded-2xl shadow-xl p-4">
                    <p className="text-xs font-bold text-[#1E3A8A]">Akreditasi</p>
                    <p className="text-2xl font-extrabold text-[#1E3A8A]">
                      {setting.akreditasi ?? "A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} hover className="text-center group">
                <CardContent className="py-8">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <p className="text-3xl font-display font-extrabold text-slate-800 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ── BERITA TERBARU ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              label="Blog & Informasi"
              title="Berita Terbaru"
              subtitle="Ikuti perkembangan terkini dari kegiatan dan pencapaian sekolah kami"
            />
            <Link href="/berita" className="hidden md:flex items-center gap-1 text-[#1E3A8A] font-semibold text-sm hover:gap-2 transition-all">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {beritaList.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-12">
              Belum ada berita yang dipublikasikan.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {beritaList.map((berita) => (
                <Card key={berita.id} hover className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {berita.thumbnail ? (
                      <Image
                        src={berita.thumbnail}
                        alt={berita.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <CalendarDays className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <CardContent>
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                    <h3 className="font-display font-semibold text-slate-800 text-base mb-2 line-clamp-2 hover:text-[#1E3A8A] transition-colors">
                      {berita.judul}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {berita.deskripsi}
                    </p>
                    <Link href={`/berita/${berita.slug}`}>
                      <Button size="sm" variant="ghost" className="px-0 hover:px-3 group">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── KEGIATAN TERBARU ─────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <SectionTitle
            label="Agenda & Event"
            title="Kegiatan Terbaru"
            subtitle="Program unggulan dan kegiatan yang membentuk karakter siswa"
          />
          <Link href="/kegiatan" className="hidden md:flex items-center gap-1 text-[#1E3A8A] font-semibold text-sm hover:gap-2 transition-all">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-12">
            Belum ada kegiatan.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {kegiatanList.map((kegiatan) => (
              <Card key={kegiatan.id} hover className="overflow-hidden group">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {kegiatan.thumbnail ? (
                    <Image
                      src={kegiatan.thumbnail}
                      alt={kegiatan.judul}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <CalendarDays className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-display font-semibold text-sm leading-tight">
                      {kegiatan.judul}
                    </p>
                  </div>
                </div>
                <CardContent className="py-3 px-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── GURU PREVIEW ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              label="Tenaga Pendidik"
              title="Guru Kami"
              subtitle="Didampingi oleh pendidik profesional dan berpengalaman di bidangnya"
            />
            <Link href="/guru" className="hidden md:flex items-center gap-1 text-[#1E3A8A] font-semibold text-sm hover:gap-2 transition-all">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {guruList.map((guru) => (
              <div key={guru.id} className="text-center group">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  {guru.foto ? (
                    <Image
                      src={guru.foto}
                      alt={guru.nama}
                      fill
                      className="object-cover rounded-full border-4 border-white shadow-lg group-hover:border-[#FBBF24] group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-4 border-white shadow-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {guru.nama.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="font-display font-semibold text-sm text-slate-800 group-hover:text-[#1E3A8A] transition-colors">
                  {guru.nama}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{guru.jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] rounded-3xl px-8 py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FBBF24]/10 rounded-full blur-2xl" />
          <div className="relative">
            <span className="inline-block bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Pendaftaran Dibuka
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-4">
              Bergabunglah Bersama Kami
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Jadilah bagian dari keluarga besar {setting.shortName ?? setting.schoolName} dan raih masa depanmu bersama kami.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/kontak">
                <Button size="lg" variant="secondary">
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/profil">
                <button className="px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300">
                  Pelajari Lebih Lanjut
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}