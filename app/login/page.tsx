
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { GraduationCap, Lock, Mail, Eye } from 'lucide-react'
import { theme } from '@/lib/data'

export default function LoginPage() {

  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Login gagal")
        setLoading(false)
        return
      }

      window.location.href = "/admin/dashboard"

    } catch (err) {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FBBF24]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-900/50">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">{theme.school.shortName}</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <h2 className="font-display font-bold text-xl text-white mb-1">Masuk ke Dashboard</h2>
          <p className="text-slate-400 text-sm mb-6">Masukkan kredensial Anda untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/40" />
                <span className="text-xs text-slate-400">Ingat saya</span>
              </label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Lupa password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 bg-[#1E3A8A] hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 active:scale-95"
            >
              {loading ? "Memproses" : "Login"}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-right">{error}</p>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
              ← Kembali ke Website Sekolah
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2024 {theme.school.name}. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  )
}
