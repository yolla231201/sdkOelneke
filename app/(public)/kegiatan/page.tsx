export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import SectionTitle from "@/components/ui/SectionTitle"
import { prisma } from "@/lib/prisma"

type Kegiatan = {
  id: number
  judul: string
  deskripsi: string | null
  thumbnail: string | null
  tanggal: Date
  lokasi: string
}

async function getKegiatan(): Promise<Kegiatan[]> {
  return await prisma.kegiatan.findMany({
    select: {
      id: true,
      judul: true,
      deskripsi: true,
      thumbnail: true,
      tanggal: true,
      lokasi: true,
    },
    orderBy: { tanggal: "desc" },
  })
}

export default async function KegiatanPage() {
  const kegiatanList = await getKegiatan()

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Kegiatan</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-3">Kegiatan Sekolah</h1>
          <p className="text-blue-100 text-lg">Berbagai program dan kegiatan unggulan untuk membentuk siswa berprestasi</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionTitle
          label="Program Unggulan"
          title="Agenda & Kegiatan"
          subtitle="Setiap kegiatan dirancang untuk mengembangkan potensi siswa secara menyeluruh"
        />

        {kegiatanList.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-20">
            Belum ada kegiatan.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {kegiatanList.map((kegiatan) => (
              <Card key={kegiatan.id} hover className="overflow-hidden flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-slate-100">
                  {kegiatan.thumbnail ? (
                    <Image
                      src={kegiatan.thumbnail}
                      alt={kegiatan.judul}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <CalendarDays className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col justify-center">
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-2">
                    {kegiatan.judul}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {kegiatan.deskripsi}
                  </p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      {kegiatan.lokasi}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}