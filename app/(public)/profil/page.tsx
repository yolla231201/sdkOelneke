export const dynamic = "force-dynamic"

import Link from "next/link"
import { ChevronRight, Eye, Target, History, MapPin, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import SectionTitle from "@/components/ui/SectionTitle"
import { prisma } from "@/lib/prisma"

// ─── Types ───────────────────────────────────────────────────────────────────

type Setting = {
  schoolName: string
  shortName: string | null
  tagline: string | null
  founded: string | null
  npsn: string | null
  akreditasi: string | null
  address: string | null
  visi: string | null
  misi: string | null
  sejarah: string | null
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getSetting(): Promise<Setting> {
  const setting = await prisma.settings.findUnique({
    where: { id: 1 },
    select: {
      schoolName: true,
      shortName: true,
      tagline: true,
      founded: true,
      npsn: true,
      akreditasi: true,
      address: true,
      visi: true,
      misi: true,
      sejarah: true,
    },
  })
  return setting ?? { schoolName: '' ,shortName: null, tagline: null, founded: null, npsn: null, akreditasi: null, address: null, visi: null, misi: null, sejarah: null   }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProfilPage() {
  const setting = await getSetting()

  // Misi: simpan sebagai teks dipisah newline di DB, parse jadi array
  const misiList = setting.misi
    ? setting.misi.split("\n").map((m) => m.trim()).filter(Boolean)
    : []

  // Sejarah: simpan sebagai JSON string di DB, format: [{"tahun":"1965","event":"..."}]
  let sejarahList: { tahun: string; event: string }[] = []
  try {
    if (setting.sejarah) sejarahList = JSON.parse(setting.sejarah)
  } catch {
    sejarahList = []
  }

  const infoItems = [
    { label: "Tahun Berdiri", value: setting.founded ?? "-" },
    { label: "Akreditasi", value: setting.akreditasi ?? "-" },
    { label: "NPSN", value: setting.npsn ?? "-" },
    { label: "Status", value: "Negeri" },
  ]

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Profil</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-3">Profil Sekolah</h1>
          <p className="text-blue-100 text-lg">Mengenal lebih dalam tentang {setting.schoolName}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* ── Tentang ────────────────────────────────────────────────────── */}
        <section>
          <SectionTitle label="Tentang Kami" title="Mengenal Sekolah" />
          <Card>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    <strong className="text-slate-800">{setting.schoolName}</strong> adalah salah satu sekolah menengah atas negeri terbaik yang berlokasi di {setting.address ?? "Indonesia"}. Didirikan pada tahun {setting.founded ?? "-"}, sekolah ini telah melahirkan ribuan alumni berprestasi yang berkontribusi di berbagai bidang.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {setting.tagline ?? "Dengan fasilitas modern, tenaga pendidik berkualitas, dan lingkungan belajar yang kondusif, kami berkomitmen untuk mencetak generasi penerus bangsa yang unggul dalam ilmu pengetahuan dan mulia dalam akhlak."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {infoItems.map((item) => (
                    <div key={item.label} className="bg-blue-50 rounded-2xl p-4 text-center">
                      <p className="text-2xl font-display font-extrabold text-[#1E3A8A]">{item.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Visi & Misi ────────────────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Visi */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-800">Visi</h2>
              </div>
              {setting.visi ? (
                <p className="text-slate-600 leading-relaxed text-sm italic border-l-4 border-[#FBBF24] pl-4">
                  "{setting.visi}"
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">Belum ada data visi.</p>
              )}
            </CardContent>
          </Card>

          {/* Misi */}
          <Card>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-800">Misi</h2>
              </div>
              {misiList.length > 0 ? (
                <ul className="space-y-2.5">
                  {misiList.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm italic">Belum ada data misi.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── Sejarah ────────────────────────────────────────────────────── */}
        {sejarahList.length > 0 && (
          <section>
            <SectionTitle label="Timeline" title="Sejarah Sekolah" />
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1E3A8A] to-slate-200" />
              <div className="space-y-6 pl-16">
                {sejarahList.map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-10 w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform">
                      <History className="w-4 h-4" />
                    </div>
                    <Card hover>
                      <CardContent className="py-4">
                        <span className="text-[#FBBF24] font-display font-bold text-lg">{item.tahun}</span>
                        <p className="text-slate-600 text-sm mt-1">{item.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Maps ───────────────────────────────────────────────────────── */}
        <section>
          <SectionTitle label="Lokasi" title="Temukan Kami" />
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-2xl">
              <div className="relative h-72 bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#1E3A8A] mx-auto mb-3" />
                  <p className="font-semibold text-slate-700">{setting.schoolName}</p>
                  <p className="text-sm text-slate-500">{setting.address ?? "-"}</p>
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(setting.address ?? setting.schoolName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-[#1E3A8A] font-semibold hover:underline"
                  >
                    Buka di Google Maps →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  )
}