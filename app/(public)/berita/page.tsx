"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, User, ChevronRight, Search } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"
import { Card, CardContent } from "@/components/ui/Card"

// ─── Types ───────────────────────────────────────────────────────────────────

type Berita = {
  id: number
  judul: string
  slug: string
  deskripsi: string | null
  thumbnail: string | null
  createdAt: string
  publishedAt: string | null
  author: { name: string }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-4">
          <div className="h-3 bg-slate-200 rounded w-24" />
          <div className="h-3 bg-slate-200 rounded w-20" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-32" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/berita")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBeritaList(data)
    } catch (err) {
      console.error("Gagal memuat berita:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBerita() }, [fetchBerita])

  const filtered = beritaList.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase()) ||
    b.deskripsi?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Berita</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-3">Berita & Artikel</h1>
          <p className="text-blue-100 text-lg">Informasi terkini dari kegiatan dan prestasi sekolah</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search & Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          {!loading && (
            <p className="text-sm text-slate-400">
              {filtered.length} artikel ditemukan
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 text-base">
              {search ? `Tidak ada berita yang cocok dengan "${search}".` : "Belum ada berita yang dipublikasikan."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-[#1E3A8A] hover:underline"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((berita) => (
              <Card key={berita.id} hover className="overflow-hidden flex flex-col">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {berita.thumbnail ? (
                    <Image
                      src={berita.thumbnail}
                      alt={berita.judul}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <CalendarDays className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(berita.publishedAt ?? berita.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {berita.author.name}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-2 line-clamp-2 hover:text-[#1E3A8A] flex-1">
                    {berita.judul}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                    {berita.deskripsi}
                  </p>
                  <Link
                    href={`/berita/${berita.slug}`}
                    className="inline-flex items-center gap-1 text-[#1E3A8A] font-semibold text-sm hover:gap-2 transition-all"
                  >
                    Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}