"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Loader2, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function compressImage(file: File, maxSizeKB = 500): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement("img")
    const canvas = document.createElement("canvas")
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
      img.onload = () => {
        const MAX_WIDTH = 1200
        let { width, height } = img
        if (width > MAX_WIDTH) { height = Math.round((height * MAX_WIDTH) / width); width = MAX_WIDTH }
        canvas.width = width; canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
        let quality = 0.85
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file)
            if (blob.size / 1024 <= maxSizeKB || quality <= 0.3)
              resolve(new File([blob], file.name, { type: "image/jpeg" }))
            else { quality -= 0.1; tryCompress() }
          }, "image/jpeg", quality)
        }
        tryCompress()
      }
    }
    reader.readAsDataURL(file)
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: { id: string }
}

export default function AdminEditBeritaPage({ params }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const [form, setForm] = useState({
    id: 0,
    judul: "",
    slug: "",
    deskripsi: "",
    konten: "",
    thumbnail: "",
    status: "DRAFT",
    publishedAt: new Date().toISOString().split("T")[0],
  })

  // Fetch berita by id
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/berita")
        if (!res.ok) throw new Error()
        const list = await res.json()
        const berita = list.find((b: any) => b.id === Number(params.id))
        if (!berita) { toast.error("Berita tidak ditemukan"); router.push("/admin/berita"); return }

        setForm({
          id: berita.id,
          judul: berita.judul,
          slug: berita.slug,
          deskripsi: berita.deskripsi || "",
          konten: berita.konten,
          thumbnail: berita.thumbnail || "",
          status: berita.status,
          publishedAt: berita.publishedAt
            ? berita.publishedAt.split("T")[0]
            : new Date().toISOString().split("T")[0],
        })
      } catch {
        toast.error("Gagal memuat berita")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, router])

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleFile = (f: File | null) => {
    setFile(f)
    setPreviewUrl(f ? URL.createObjectURL(f) : "")
  }

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!form.judul.trim()) { toast.error("Judul wajib diisi"); return }
    if (!form.konten.trim()) { toast.error("Konten wajib diisi"); return }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("data", JSON.stringify({ ...form, status }))
      if (file) {
        const compressed = await compressImage(file)
        formData.append("file", compressed)
      }

      const res = await fetch("/api/admin/berita", { method: "PUT", body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      toast.success("Berita berhasil diperbarui!")
      router.push("/admin/berita")
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan berita")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus berita ini? Tindakan ini tidak bisa dibatalkan.")) return
    try {
      const res = await fetch("/api/admin/berita", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      })
      if (!res.ok) throw new Error()
      toast.success("Berita dihapus")
      router.push("/admin/berita")
    } catch {
      toast.error("Gagal menghapus berita")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Memuat berita…</span>
      </div>
    )
  }

  const displayThumbnail = previewUrl || form.thumbnail

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/berita"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-2xl text-white">Edit Berita</h1>
            <p className="text-slate-400 text-sm mt-0.5 truncate max-w-md">{form.judul}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Hapus Berita
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6 space-y-5">
            {/* Judul */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Judul Artikel *
              </label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => set("judul", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Slug URL
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-600 focus-within:ring-2 focus-within:ring-blue-500/40">
                <span className="px-4 py-3 bg-slate-800 text-slate-500 text-sm font-mono border-r border-slate-600">
                  /berita/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-200 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Ringkasan
              </label>
              <textarea
                rows={3}
                value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-all"
              />
            </div>

            {/* Konten */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Konten Artikel *
              </label>
              <textarea
                rows={16}
                value={form.konten}
                onChange={(e) => set("konten", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y transition-all font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                Mendukung tag HTML: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publikasi */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Publikasi</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none"
                >
                  <option value="PUBLISHED">✅ Publish</option>
                  <option value="DRAFT">📝 Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Tanggal Tayang
                </label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => handleSubmit("DRAFT")}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-300 border border-slate-600 rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Simpan Draft
              </button>
              <button
                onClick={() => handleSubmit("PUBLISHED")}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Publish
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Thumbnail</h3>
            {displayThumbnail && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-800">
                <Image src={displayThumbnail} alt="Thumbnail" fill className="object-cover" />
              </div>
            )}
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors group">
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1.5 group-hover:text-blue-400 transition-colors" />
                <p className="text-xs text-slate-400">
                  {file ? file.name : displayThumbnail ? "Ganti thumbnail" : "Pilih gambar"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}