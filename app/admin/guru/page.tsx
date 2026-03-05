"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import {
  Plus, Edit2, Trash2, GripVertical,
  BookOpen, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ─── Types ───────────────────────────────────────────────────────────────────

type Guru = {
  id: number
  nama: string
  jabatan?: string
  mapel?: string
  urutan: number
  bio?: string
  foto?: string
}

type FormState = {
  nama: string
  jabatan: string
  mapel: string
  urutan: number
  bio: string
  foto: string
}

const emptyForm: FormState = {
  nama: "", jabatan: "", mapel: "", urutan: 0, bio: "", foto: ""
}

const PAGE_SIZE = 10

// ─── Sortable Row ─────────────────────────────────────────────────────────────

function SortableRow({
  guru,
  onEdit,
  onDelete,
}: {
  guru: Guru
  onEdit: (g: Guru) => void
  onDelete: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: guru.id })

  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
  position: isDragging ? "relative" as const : undefined,  // ← tambah ini
  zIndex: isDragging ? 50 : undefined,
}

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-slate-700/20 border-b border-slate-700/30 last:border-0"
    >
      <td className="px-4 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
            {guru.foto ? (
              <Image src={guru.foto} alt={guru.nama} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                {guru.nama.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-200 font-medium">{guru.nama}</p>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell text-slate-400 text-sm">
        {guru.jabatan || <span className="text-slate-600">-</span>}
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        {guru.mapel ? (
          <span className="inline-flex items-center gap-1 bg-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full">
            <BookOpen className="w-3 h-3" />
            {guru.mapel}
          </span>
        ) : (
          <span className="text-slate-600 text-xs">-</span>
        )}
      </td>
      <td className="px-4 py-4 hidden sm:table-cell text-slate-500 text-xs">
        {guru.urutan}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-1">
          <button
            onClick={() => onEdit(guru)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(guru.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function GuruModal({
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

  const fields = [
    { label: "Nama Lengkap *", field: "nama", type: "text" },
    { label: "Jabatan", field: "jabatan", type: "text" },
    { label: "Mata Pelajaran", field: "mapel", type: "text" },
    { label: "Urutan Tampil", field: "urutan", type: "number" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-2xl bg-[#1e293b] rounded-2xl border border-slate-700/60 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <h2 className="font-semibold text-white text-lg">
            {selectedId ? "Edit Guru" : "Tambah Guru Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((item) => (
              <div key={item.field}>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                  {item.label}
                </label>
                <input
                  type={item.type}
                  value={(form as any)[item.field]}
                  onChange={(e) => onChange(item.field, e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              Bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800/70 border border-slate-600/60 focus:border-blue-500 focus:outline-none text-slate-200 rounded-xl text-sm resize-none transition-colors"
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wide">
              Foto
            </label>
            <div className="flex items-center gap-4">
              {(file || form.foto) && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
                  <Image
                    src={file ? URL.createObjectURL(file) : form.foto}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-3 bg-slate-800/70 border border-dashed border-slate-600 hover:border-blue-500 rounded-xl text-sm text-slate-400 hover:text-slate-300 transition-colors text-center">
                  {file ? file.name : "Klik untuk pilih foto…"}
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
            disabled={saving || !form.nama.trim()}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {selectedId ? "Update Guru" : "Simpan Guru"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminGuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [page, setPage] = useState(1)

  const sensors = useSensors(useSensor(PointerSensor))

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchGuru = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/guru")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setGuruList(data)
    } catch {
      toast.error("Gagal memuat data guru")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGuru() }, [fetchGuru])

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(guruList.length / PAGE_SIZE))
  const paginated = guruList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = guruList.findIndex((g) => g.id === active.id)
    const newIndex = guruList.findIndex((g) => g.id === over.id)

    // Optimistic UI — update lokal dulu
    const reordered = arrayMove(guruList, oldIndex, newIndex).map((g, i) => ({
      ...g,
      urutan: i,
    }))
    setGuruList(reordered)

    // Sync ke backend
    try {
      const res = await fetch("/api/admin/guru", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reordered }),
      })
      if (!res.ok) throw new Error()
      toast.success("Urutan disimpan")
    } catch {
      toast.error("Gagal simpan urutan, memuat ulang...")
      fetchGuru() // rollback
    }
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setSelectedId(null)
    setForm(emptyForm)
    setFile(null)
    setModalOpen(true)
  }

  const openEdit = (guru: Guru) => {
    setSelectedId(guru.id)
    setForm({
      nama: guru.nama,
      jabatan: guru.jabatan || "",
      mapel: guru.mapel || "",
      urutan: guru.urutan,
      bio: guru.bio || "",
      foto: guru.foto || "",
    })
    setFile(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const compressImage = (file: File, maxSizeKB = 500): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement("img")
      const canvas = document.createElement("canvas")
      const reader = new FileReader()

      reader.onload = (e) => {
        img.src = e.target?.result as string
        img.onload = () => {
          const MAX_WIDTH = 800
          let { width, height } = img

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }

          canvas.width = width
          canvas.height = height
          canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)

          let quality = 0.8
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

  const handleSubmit = async () => {
    if (!form.nama.trim()) {
      toast.error("Nama wajib diisi")
      return
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append("data", JSON.stringify({ id: selectedId, ...form }))

      if (file) {
        const compressed = await compressImage(file) // ← tambah ini
        formData.append("file", compressed)
      }

      const res = await fetch("/api/admin/guru", {
        method: selectedId ? "PUT" : "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      toast.success(selectedId ? "Guru berhasil diupdate" : "Guru berhasil ditambahkan")
      setModalOpen(false)
      fetchGuru()
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan guru")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus guru ini?")) return
    try {
      const res = await fetch("/api/admin/guru", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      toast.success("Guru dihapus")
      setGuruList((prev) => prev.filter((g) => g.id !== id))
    } catch {
      toast.error("Gagal menghapus guru")
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-2xl text-white">Manajemen Guru</h1>
            <p className="text-slate-400 text-sm mt-1">
              {guruList.length} tenaga pendidik terdaftar
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Guru
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden mb-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Memuat data…</span>
            </div>
          ) : guruList.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              Belum ada data guru.{" "}
              <button onClick={openCreate} className="text-blue-400 hover:underline">
                Tambah sekarang
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={paginated.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="px-4 py-3 w-8" />
                      <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase tracking-wide">
                        Guru
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase tracking-wide hidden md:table-cell">
                        Jabatan
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase tracking-wide hidden lg:table-cell">
                        Mata Pelajaran
                      </th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                        Urutan
                      </th>
                      <th className="px-6 py-3 text-right text-xs text-slate-400 uppercase tracking-wide">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((guru) => (
                      <SortableRow
                        key={guru.id}
                        guru={guru}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Halaman {page} dari {totalPages} &middot; {guruList.length} data
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
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page
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
      <GuruModal
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