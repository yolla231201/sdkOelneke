'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/guru', label: 'Guru' },
  { href: '/kontak', label: 'Kontak' },
]

type Setting = {
  schoolName: string
  shortName: string | null
  tagline: string | null
  logo: string | null
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [setting, setSetting] = useState<Setting | null>(null)

  useEffect(() => {
    fetch('/api/setting')
      .then(res => res.json())
      .then(data => setSetting(data))
      .catch(() => { })
  }, [])

  const shortName = setting?.shortName ?? setting?.schoolName ?? '...'
  const tagline = setting?.tagline ?? ''
  const logo = setting?.logo ?? null

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt={shortName}
                width={36}
                height={36}
                className="w-full h-full object-contain p-0.5"
              />
            ) : (
              <GraduationCap className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#1E3A8A] leading-tight font-display">
              {shortName}
            </p>
            {tagline && (
              <p className="text-xs text-slate-500 leading-tight mt-0.5 max-w-[200px] truncate">
                {tagline}
              </p>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-[#1E3A8A] hover:bg-blue-50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button size="sm" variant="outline">Admin</Button>
          </Link>
          <Link href="/berita">
            <Button size="sm">Daftar Sekarang</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-blue-50 hover:text-[#1E3A8A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link href="/admin/dashboard" className="flex-1">
              <Button size="sm" variant="outline" className="w-full">Admin</Button>
            </Link>
            <Link href="/berita" className="flex-1">
              <Button size="sm" className="w-full">Daftar</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}