"use client"

import { useEffect, useState } from "react"
import { Save, Upload } from "lucide-react"
import Button from "@/components/ui/Button"
import { toast } from "react-hot-toast"
import Loading from "@/components/ui/Loading";

type Settings = {
  id?: number
  schoolName?: string
  shortName?: string
  tagline?: string
  founded?: string
  npsn?: string
  akreditasi?: string
  siswaAktif?: string
  prestasi?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  kodePos?: string
  visi?: string
  misi?: string
  sejarah?: string
  logo?: string
  heroImage?: string
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
  updatedAt?: string
}

export default function AdminProfilPage() {
  const defaultSettings: Settings = {}
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Gagal mengambil data")
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("data", JSON.stringify(settings))
      const res = await fetch("/api/admin/settings", { method: "POST", body: formData })
      const updated = await res.json()
      setSettings(updated)
      toast.success("Data berhasil disimpan!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan data")
    }
  }

  // Taruh di atas komponen
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

  if (loading) return <div className="flex items-center justify-center">
    <Loading />
  </div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Profil Sekolah</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola informasi dan identitas sekolah</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identitas */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6">
            <h2 className="font-semibold text-slate-200 text-sm mb-5">Identitas Sekolah</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Nama Sekolah", name: "schoolName" },
                { label: "Singkatan / Alias", name: "shortName" },
                { label: "Tagline", name: "tagline" },
                { label: "Tahun Berdiri", name: "founded" },
                { label: "NPSN", name: "npsn" },
                { label: "Akreditasi", name: "akreditasi" },
                { label: "Siswa aktif", name: "siswaAktif" },
                { label: "Prestasi", name: "prestasi" },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={settings[field.name as keyof Settings] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Kontak */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6">
            <h2 className="font-semibold text-slate-200 text-sm mb-5">Informasi Kontak</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              {[
                { label: "Nomor Telepon", name: "phone" },
                { label: "Email", name: "email" },
                { label: "Website", name: "website" },
                { label: "Kode Pos", name: "kodePos" },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={settings[field.name as keyof Settings] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visi Misi */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6">
            <h2 className="font-semibold text-slate-200 text-sm mb-5">Visi & Misi</h2>
            <div className="space-y-4">
              {[
                { label: "Visi Sekolah", name: "visi", rows: 3 },
                { label: "Misi Sekolah", name: "misi", rows: 6 },
                { label: "Sejarah Singkat", name: "sejarah", rows: 4 },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{field.label}</label>
                  <textarea
                    name={field.name}
                    rows={field.rows}
                    value={settings[field.name as keyof Settings] || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Hero Image */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">

            {/* Preview Logo Lama */}
            {settings.logo && (
              <div className="mb-4 text-center">
                <img
                  src={settings.logo}
                  alt="Logo Sekolah"
                  className="mx-auto max-h-32 object-contain rounded-lg  p-2 bg-slate-800"
                />
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors relative">
              <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Upload Logo Baru</p>

              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                className="absolute w-full h-full opacity-0 cursor-pointer inset-0"
                onChange={async e => {
                  if (!e.target.files?.[0]) return
                  setUploading(true)
                  try {
                    const file = e.target.files[0]
                    const compressed = await compressImage(file)  // ← kompres dulu
                    const formData = new FormData()
                    formData.append("file", compressed)           // ← kirim yang sudah dikompres
                    formData.append("fileType", "logo")           // atau "heroImage"
                    formData.append("data", JSON.stringify(settings))

                    const res = await fetch("/api/admin/settings", {
                      method: "POST",
                      body: formData
                    })

                    const updated = await res.json()
                    setSettings(updated)
                    toast.success("Data dan logo berhasil diupdate!")
                  } catch (err) {
                    console.error(err)
                    toast.error("Gagal upload logo")
                  } finally {
                    setUploading(false)
                  }
                }}
              />

              <p className="text-xs text-slate-600 mt-1">
                PNG transparan direkomendasikan
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">

            {/* Preview Hero Image Lama */}
            {settings.heroImage && (
              <div className="mb-4 text-center">
                <img
                  src={settings.heroImage}
                  alt="Hero Image"
                  className="mx-auto max-h-32 object-contain rounded-lg  p-2 bg-slate-800"
                />
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors relative">
              <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Upload Gambar Banner</p>

              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                className="absolute w-full h-full opacity-0 cursor-pointer inset-0"
                onChange={async e => {
                  if (!e.target.files?.[0]) return
                  setUploading(true)
                  try {
                    const file = e.target.files[0]
                    const compressed = await compressImage(file)  // ← kompres dulu
                    const formData = new FormData()
                    formData.append("file", compressed)           // ← kirim yang sudah dikompres
                    formData.append("fileType", "heroImage")           // atau "heroImage"
                    formData.append("data", JSON.stringify(settings))

                    const res = await fetch("/api/admin/settings", {
                      method: "POST",
                      body: formData
                    })

                    const updated = await res.json()
                    setSettings(updated)
                    toast.success("Data dan hero image berhasil diupdate!")
                  } catch (err) {
                    console.error(err)
                    toast.error("Gagal hero image")
                  } finally {
                    setUploading(false)
                  }
                }}
              />

              <p className="text-xs text-slate-600 mt-1">
                Untuk Halaman Utama Website
              </p>
            </div>
          </div>

          {/* Save */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Simpan Perubahan</h3>
            <p className="text-xs text-slate-500 mb-4">Pastikan semua informasi sudah benar sebelum menyimpan.</p>
            <Button onClick={handleSave} className="w-full" disabled={uploading}>
              <Save className="w-4 h-4" /> Simpan Semua Perubahan
            </Button>
          </div>

          {/* Sosial Media */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4">Media Sosial</h3>
            <div className="space-y-3">
              {["facebook", "instagram", "youtube", "twitter"].map(platform => (
                <div key={platform}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                  <input
                    type="url"
                    name={platform}
                    value={settings[platform as keyof Settings] || ""}
                    onChange={handleChange}
                    placeholder={`URL ${platform}`}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}