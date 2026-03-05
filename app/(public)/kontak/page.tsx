import Link from "next/link"
import { ChevronRight, MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"

type Setting = {
  address: string | null
  phone: string | null
  email: string | null
}

async function getSetting(): Promise<Setting> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/setting`, { next: { revalidate: 3600 } })
  if (!res.ok) return { address: null, phone: null, email: null }
  return res.json()
}

export default async function KontakPage() {
  const setting = await getSetting()

  const contacts = [
    { icon: MapPin, label: "Alamat", value: setting.address ?? "-", color: "text-blue-600 bg-blue-50" },
    { icon: Phone, label: "Telepon", value: setting.phone ?? "-", color: "text-emerald-600 bg-emerald-50" },
    { icon: Mail, label: "Email", value: setting.email ?? "-", color: "text-amber-600 bg-amber-50" },
    { icon: Clock, label: "Jam Kerja", value: "Senin - Jumat: 07.00 - 15.00 WIB", color: "text-purple-600 bg-purple-50" },
  ]

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1e40af] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Kontak</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-3">Hubungi Kami</h1>
          <p className="text-blue-100 text-lg">Kami siap membantu menjawab pertanyaan Anda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {contacts.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label}>
                  <CardContent className="flex items-start gap-4 py-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-700 font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent>
                <h2 className="font-display font-bold text-xl text-slate-800 mb-6">Kirim Pesan</h2>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama Anda"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Subjek
                    </label>
                    <input
                      type="text"
                      placeholder="Subjek pesan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Pesan
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tulis pesan Anda di sini..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-none transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}