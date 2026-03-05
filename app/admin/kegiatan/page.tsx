"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import {
  Plus, Edit2, Trash2, CalendarDays,
  MapPin, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react"
import { toast } from "react-hot-toast"

// ─── Types ───────────────────────────────────────────────────────────────────

type Kegiatan = {
  id: number
  judul: string
  deskripsi?: string
  thumbnail?: string
  tanggal: string
  lokasi: string
}

type FormState = {
  judul: string
  deskripsi: string
  lokasi: string
  tanggal: string
  thumbnail: string
}

const emptyForm: FormState = {
  judul: "", deskripsi: "", lokasi: "", tanggal: "", thumbnail: ""
}

const PAGE_SIZE = 6

// ─── Compress Image ───────────────────────────────────────────────────────────

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
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)

        let quality = 0.85
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file)
            if (blob.size / 1024 <= maxSizeKB || quality <= 0.3) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }))
            } else {
              quality -= 0.1
              tryCompress()
            }
          }, "image/jpeg", quality)
        }
        tryCompress()
      }
    }
    reader.readAsDataURL(file)
  })
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function KegiatanModal({
  open,
  selectedId,
  form,
  file,
  saving,
  onClose,
  onChange,
  onFileChange,
  onSubmit,
}: {
  open: boolean
  selectedId: number | null
  form: FormState
  file: File | null
  saving: boolean
  onClose: () => void
  onChange: (field: string, value: string) => void
  onFileChange: (f: File | null) => void
  onSubmit: () => void
}) {
  if (!open) return null

  const previewSrc = file ? URL.createObjectURL(file) : form.thumbnail

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#1e293b] rounded-2xl border border-slate-700/60 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <h2 className="font-semibold text-white text-lg">
            {selectedId ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Judul */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Judul Kegiatan *
            </label>
            <input
              type="text"
              value={form.judul}
              onChange={(e) => onChange("judul", e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm transition-colors"
            />
          </div>

          {/* Tanggal & Lokasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                Tanggal *
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => onChange("tanggal", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                Lokasi *
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => onChange("lokasi", e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm transition-colors"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Deskripsi
            </label>
            <textarea
              rows={4}
              value={form.deskripsi}
              onChange={(e) => onChange("deskripsi", e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm resize-none transition-colors"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wide">
              Thumbnail
            </label>
            {previewSrc && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-800">
                <Image src={previewSrc} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <label className="cursor-pointer block">
              <div className="px-4 py-3 bg-slate-800/70 border border-dashed border-slate-600 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-slate-300 transition-colors text-center">
                {file ? file.name : "Klik untuk pilih gambar…"}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={saving || !form.judul.trim() || !form.lokasi.trim() || !form.tanggal}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {selectedId ? "Update Kegiatan" : "Simpan Kegiatan"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [page, setPage] = useState(1)

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchKegiatan = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/kegiatan")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setKegiatanList(data)
    } catch {
      toast.error("Gagal memuat data kegiatan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchKegiatan() }, [fetchKegiatan])

  // ── Pagination ────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(kegiatanList.length / PAGE_SIZE))
  const paginated = kegiatanList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Form Handlers ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setSelectedId(null)
    setForm(emptyForm)
    setFile(null)
    setModalOpen(true)
  }

  const openEdit = (k: Kegiatan) => {
    setSelectedId(k.id)
    setForm({
      judul: k.judul,
      deskripsi: k.deskripsi || "",
      lokasi: k.lokasi,
      tanggal: k.tanggal.split("T")[0],
      thumbnail: k.thumbnail || "",
    })
    setFile(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const handleSubmit = async () => {
    if (!form.judul.trim() || !form.lokasi.trim() || !form.tanggal) {
      toast.error("Judul, tanggal, dan lokasi wajib diisi")
      return
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("data", JSON.stringify({ id: selectedId, ...form }))

      if (file) {
        const compressed = await compressImage(file)
        formData.append("file", compressed)
      }

      const res = await fetch("/api/admin/kegiatan", {
        method: selectedId ? "PUT" : "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      toast.success(selectedId ? "Kegiatan berhasil diupdate" : "Kegiatan berhasil ditambahkan")
      setModalOpen(false)
      fetchKegiatan()
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan kegiatan")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return
    try {
      const res = await fetch("/api/admin/kegiatan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success("Kegiatan dihapus")
      setKegiatanList((prev) => prev.filter((k) => k.id !== id))
    } catch {
      toast.error("Gagal menghapus kegiatan")
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-2xl text-white">Manajemen Kegiatan</h1>
            <p className="text-slate-400 text-sm mt-1">
              {kegiatanList.length} total kegiatan
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Kegiatan
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data…</span>
          </div>
        ) : kegiatanList.length === 0 ? (
          <div className="py-32 text-center text-slate-500 text-sm">
            Belum ada kegiatan.{" "}
            <button onClick={openCreate} className="text-blue-400 hover:underline">
              Tambah sekarang
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {paginated.map((kegiatan) => (
              <div
                key={kegiatan.id}
                className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-800">
                  {kegiatan.thumbnail ? (
                    <Image
                      src={kegiatan.thumbnail}
                      alt={kegiatan.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <CalendarDays className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-2 line-clamp-1">
                    {kegiatan.judul}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {kegiatan.deskripsi || <span className="italic text-slate-600">Tidak ada deskripsi</span>}
                  </p>
                  <div className="space-y-1 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {kegiatan.lokasi}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(kegiatan)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-400 border border-amber-400/30 rounded-lg hover:bg-amber-400/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kegiatan.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Halaman {page} dari {totalPages} &middot; {kegiatanList.length} data
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
                    p === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-700 text-slate-400"
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

      {/* Modal */}
      <KegiatanModal
        open={modalOpen}
        selectedId={selectedId}
        form={form}
        file={file}
        saving={saving}
        onClose={closeModal}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        onFileChange={setFile}
        onSubmit={handleSubmit}
      />
    </>
  )
}