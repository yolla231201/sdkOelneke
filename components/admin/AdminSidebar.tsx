'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import {
  LayoutDashboard, Newspaper, CalendarDays, Users, School,
  GraduationCap, LogOut, ChevronRight,
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/berita', label: 'Berita', icon: Newspaper },
  { href: '/admin/kegiatan', label: 'Kegiatan', icon: CalendarDays },
  { href: '/admin/guru', label: 'Guru', icon: Users },
  { href: '/admin/profil', label: 'Profil Sekolah', icon: School },
]

type Setting = {
  schoolName: string
  shortName: string | null
  logo: string | null
}

type User = {
  id: number
  name: string
  email: string
  role: string
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [setting, setSetting] = useState<Setting | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Fetch setting
    fetch('/api/setting')
      .then(res => res.json())
      .then(data => setSetting(data))
      .catch(() => { })

    // Fetch current user session
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.id) setUser(data)  // pastikan response valid
      })
      .catch(() => { })
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
     window.location.href = '/login'
    }
  }

  const shortName = setting?.shortName ?? setting?.schoolName ?? '...'
  const initials = user?.name?.charAt(0).toUpperCase() ?? 'A'

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0F172A] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            {setting?.logo ? (
              <Image
                src={setting.logo}
                alt={shortName}
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <GraduationCap className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white font-display">{shortName}</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 admin-scroll overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu Utama</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name ?? 'Administrator'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email ?? '...'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  )
}