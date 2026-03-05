import Image from 'next/image'
import { Plus, Edit2, Trash2, GripVertical, BookOpen } from 'lucide-react'
import { guruList } from '@/lib/data'
import Button from '@/components/ui/Button'

export default function AdminGuruPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Manajemen Guru</h1>
          <p className="text-slate-400 text-sm mt-1">{guruList.length} tenaga pendidik terdaftar</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" /> Tambah Guru
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider w-8"></th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Guru</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Jabatan</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Mata Pelajaran</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Urutan</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {guruList.map((guru) => (
              <tr key={guru.id} className="hover:bg-slate-700/20 transition-colors group">
                <td className="px-4 py-4">
                  <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={guru.foto} alt={guru.nama} fill className="object-cover" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">{guru.nama}</p>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-slate-400">{guru.jabatan}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  {guru.mapel !== '-' ? (
                    <div className="inline-flex items-center gap-1 bg-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                      <BookOpen className="w-3 h-3" />{guru.mapel}
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="text-xs text-slate-500">{guru.urutan}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Guru Form */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-6">
        <h2 className="font-display font-semibold text-white text-base mb-5">Tambah Guru Baru</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {['Nama Lengkap', 'Jabatan', 'Mata Pelajaran', 'Urutan Tampil'].map((label) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
              <input
                type={label === 'Urutan Tampil' ? 'number' : 'text'}
                placeholder={label}
                className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Upload Foto</label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
              <span className="text-sm text-slate-400">Pilih foto guru...</span>
            </div>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4" /> Simpan Guru
          </Button>
        </div>
      </div>
    </div>
  )
}
