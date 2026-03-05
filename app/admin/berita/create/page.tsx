"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

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

export default function AdminCreateBeritaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  const [form, setForm] = useState({
    judul: "",
    slug: "",
    deskripsi: "",
    konten: "",
    status: "DRAFT",
    publishedAt: new Date().toISOString().split("T")[0],
    // NOTE: ganti authorId sesuai ID user yang sedang login
    authorId: 1,
  })

  const set = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "judul" && !slugManual) {
        next.slug = generateSlug(value)
      }
      return next
    })
  }

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

      const res = await fetch("/api/admin/berita", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      toast.success(status === "PUBLISHED" ? "Berita dipublikasikan!" : "Draft disimpan!")
      router.push("/admin/berita")
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan berita")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/berita"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-2xl text-white">Tambah Berita</h1>
          <p className="text-slate-400 text-sm mt-0.5">Buat artikel berita baru</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6 space-y-5">
            <h2 className="font-semibold text-slate-200 text-sm">Konten Artikel</h2>

            {/* Judul */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Judul Artikel *
              </label>
              <input
                type="text"
                placeholder="Masukkan judul berita yang menarik..."
                value={form.judul}
                onChange={(e) => set("judul", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
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
                  placeholder="judul-artikel-baru"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); set("slug", e.target.value) }}
                  className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">Otomatis dibuat dari judul. Edit jika perlu.</p>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Ringkasan
              </label>
              <textarea
                rows={3}
                placeholder="Ringkasan singkat artikel (akan muncul di listing berita)..."
                value={form.deskripsi}
                onChange={(e) => set("deskripsi", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-all"
              />
            </div>

            {/* Konten */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Konten Artikel *
              </label>
              <textarea
                rows={16}
                placeholder="Tulis konten artikel lengkap di sini..."
                value={form.konten}
                onChange={(e) => set("konten", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y transition-all font-mono"
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
                  Tanggal Tayang
                </label>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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
            {previewUrl && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-800">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-5 text-center hover:border-blue-500/50 transition-colors group">
                <Upload className="w-7 h-7 text-slate-500 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
                <p className="text-xs text-slate-400">
                  {file ? file.name : "Klik atau drag & drop gambar"}
                </p>
                <p className="text-xs text-slate-600 mt-1">JPG, PNG, WEBP</p>
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