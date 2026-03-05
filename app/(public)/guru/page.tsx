import Image from "next/image"
import Link from "next/link"
import { ChevronRight, BookOpen } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"

type Guru = {
  id: number
  nama: string
  jabatan: string | null
  mapel: string | null
  foto: string | null
  urutan: number
}

async function getGuru(): Promise<Guru[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/guru`, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return res.json()
}

export default async function GuruPage() {
  const guruList = await getGuru()

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Guru</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-3">Tenaga Pendidik</h1>
          <p className="text-blue-100 text-lg">Guru-guru profesional dan berpengalaman yang siap membimbing siswa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionTitle
          label="Tim Pengajar"
          title="Daftar Guru & Staf"
          subtitle={`Kami memiliki ${guruList.length} tenaga pendidik berkualitas dengan pengalaman dan kompetensi tinggi`}
          center
        />

        {guruList.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-20">
            Belum ada data guru.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {guruList.map((guru) => (
              <div key={guru.id} className="group text-center">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {guru.foto ? (
                      <Image
                        src={guru.foto}
                        alt={guru.nama}
                        fill
                        className="object-cover rounded-full border-4 border-slate-100 group-hover:border-[#FBBF24] transition-colors"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-slate-100 group-hover:border-[#FBBF24] transition-colors bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl mx-auto">
                        {guru.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 text-sm mb-1 group-hover:text-[#1E3A8A] transition-colors">
                    {guru.nama}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{guru.jabatan}</p>
                  {guru.mapel && guru.mapel !== "-" && (
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-[#1E3A8A] text-xs font-medium px-3 py-1 rounded-full">
                      <BookOpen className="w-3 h-3" />
                      {guru.mapel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}