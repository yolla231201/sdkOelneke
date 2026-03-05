"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  Newspaper, Users, CalendarDays, Eye,
  ArrowUpRight, TrendingUp, Plus, Loader2
} from "lucide-react"
import { toast } from "react-hot-toast"

// ─── Types ───────────────────────────────────────────────────────────────────

type RecentBerita = {
  id: number
  judul: string
  slug: string
  status: "DRAFT" | "PUBLISHED"
  createdAt: string
}

type DashboardData = {
  stats: {
    totalBerita: number
    totalGuru: number
    totalKegiatan: number
  }
  recentBerita: RecentBerita[]
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return status === "PUBLISHED" ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/40 text-green-400 border border-green-800/50">
      Publish
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
      Draft
    </span>
  )
}

// ─── Stat Card Skeleton ───────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700/50 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-xl" />
        <div className="w-4 h-4 bg-slate-700 rounded" />
      </div>
      <div className="h-8 w-16 bg-slate-700 rounded mb-2" />
      <div className="h-4 w-24 bg-slate-700 rounded" />
      <div className="h-3 w-20 bg-slate-700 rounded mt-2" />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/dashboard")
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
    } catch {
      toast.error("Gagal memuat data dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const stats = [
    {
      label: "Total Berita",
      value: data?.stats.totalBerita ?? 0,
      icon: Newspaper,
      bg: "bg-blue-500/20",
      color: "text-blue-400",
      change: "Semua artikel",
    },
    {
      label: "Total Guru",
      value: data?.stats.totalGuru ?? 0,
      icon: Users,
      bg: "bg-amber-500/20",
      color: "text-amber-400",
      change: "Tenaga pendidik",
    },
    {
      label: "Total Kegiatan",
      value: data?.stats.totalKegiatan ?? 0,
      icon: CalendarDays,
      bg: "bg-emerald-500/20",
      color: "text-emerald-400",
      change: "Semua kegiatan",
    },
  ]

  const quickLinks = [
    { href: "/admin/berita/create", label: "Tambah Berita Baru", icon: Newspaper, color: "bg-blue-600" },
    { href: "/admin/kegiatan", label: "Kelola Kegiatan", icon: CalendarDays, color: "bg-emerald-600" },
    { href: "/admin/guru", label: "Data Guru", icon: Users, color: "bg-amber-600" },
    { href: "/admin/profil", label: "Edit Profil Sekolah", icon: Eye, color: "bg-purple-600" },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Selamat datang kembali, Administrator!</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="bg-[#1e293b] rounded-xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-extrabold text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                  <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
                </div>
              )
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Berita */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
            <h2 className="font-semibold text-white text-base">Berita Terbaru</h2>
            <Link
              href="/admin/berita/create"
              className="flex items-center gap-1.5 text-blue-400 text-xs font-medium hover:text-blue-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-700/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center justify-between animate-pulse">
                  <div className="flex-1 mr-4 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-700 rounded w-1/4" />
                  </div>
                  <div className="h-5 w-16 bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : data?.recentBerita.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500 text-sm">
              Belum ada berita.{" "}
              <Link href="/admin/berita/create" className="text-blue-400 hover:underline">
                Tambah sekarang
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {data?.recentBerita.map((b) => (
                <div
                  key={b.id}
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-700/20 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-slate-200 font-medium truncate">{b.judul}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(b.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <Link href={`/admin/berita/edit/${b.id}`}>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-3 border-t border-slate-700/50">
            <Link href="/admin/berita" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              Lihat semua berita →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="font-semibold text-white text-base">Aksi Cepat</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/40 transition-colors group"
                >
                  <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                    {item.label}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 ml-auto transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}