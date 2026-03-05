"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit2, Trash2, Search, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "react-hot-toast"

// ─── Types ───────────────────────────────────────────────────────────────────

type Berita = {
  id: number
  judul: string
  slug: string
  deskripsi?: string
  thumbnail?: string
  status: "DRAFT" | "PUBLISHED"
  publishedAt?: string
  createdAt: string
  author: { id: number; name: string }
}

const PAGE_SIZE = 10

// ─── Badge ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return status === "PUBLISHED" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/40 text-green-400 border border-green-800/50">
      ● Publish
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
      ● Draft
    </span>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)

      const res = await fetch(`/api/admin/berita?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBeritaList(data)
      setPage(1)
    } catch {
      toast.error("Gagal memuat data berita")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => { fetchBerita() }, [fetchBerita])

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return
    try {
      const res = await fetch("/api/admin/berita", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success("Berita dihapus")
      setBeritaList((prev) => prev.filter((b) => b.id !== id))
    } catch {
      toast.error("Gagal menghapus berita")
    }
  }

  const totalPages = Math.max(1, Math.ceil(beritaList.length / PAGE_SIZE))
  const paginated = beritaList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl text-white">Manajemen Berita</h1>
          <p className="text-slate-400 text-sm mt-1">{beritaList.length} total artikel</p>
        </div>
        <Link
          href="/admin/berita/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Berita
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="PUBLISHED">Publish</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data…</span>
          </div>
        ) : beritaList.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            {search || statusFilter ? "Tidak ada hasil yang cocok." : "Belum ada berita."}{" "}
            {!search && !statusFilter && (
              <Link href="/admin/berita/create" className="text-blue-400 hover:underline">
                Tambah sekarang
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Artikel
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  Tanggal
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {paginated.map((berita) => (
                <tr key={berita.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                        {berita.thumbnail ? (
                          <Image src={berita.thumbnail} alt={berita.judul} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-lg font-bold">
                            N
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate max-w-xs">
                          {berita.judul}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          By {berita.author?.name || "Admin"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-400">
                      {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={berita.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/berita/${berita.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/berita/edit/${berita.id}`}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(berita.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Halaman {page} dari {totalPages} &middot; {beritaList.length} data
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  p === page ? "bg-blue-600 text-white" : "hover:bg-slate-700 text-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}