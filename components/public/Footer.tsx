'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

type Setting = {
  schoolName: string
  shortName: string | null
  tagline: string | null
  founded: string | null
  address: string | null
  phone: string | null
  email: string | null
  logo: string | null
  facebook: string | null
  instagram: string | null
  youtube: string | null
  twitter: string | null
}

const navLinks = [
  { href: '/profil', label: 'Profil Sekolah' },
  { href: '/berita', label: 'Berita & Artikel' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/guru', label: 'Daftar Guru' },
  { href: '/kontak', label: 'Hubungi Kami' },
]

export default function Footer() {
  const [setting, setSetting] = useState<Setting | null>(null)

  useEffect(() => {
    fetch('/api/setting')
      .then(res => res.json())
      .then(data => setSetting(data))
      .catch(() => {})
  }, [])

  const shortName = setting?.shortName ?? setting?.schoolName ?? '...'
  const schoolName = setting?.schoolName ?? '...'
  const tagline = setting?.tagline ?? ''
  const founded = setting?.founded ?? ''

  const socialLinks = [
    { icon: Facebook, href: setting?.facebook, label: 'Facebook' },
    { icon: Instagram, href: setting?.instagram, label: 'Instagram' },
    { icon: Youtube, href: setting?.youtube, label: 'Youtube' },
    { icon: Twitter, href: setting?.twitter, label: 'Twitter' },
  ].filter(s => s.href)

  return (
    <footer className="bg-[#0F172A] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center overflow-hidden flex-shrink-0">
                {setting?.logo ? (
                  <Image
                    src={setting.logo}
                    alt={shortName}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <GraduationCap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="font-display font-bold text-white text-base">{shortName}</p>
                {tagline && <p className="text-xs text-slate-500 leading-tight">{tagline}</p>}
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Mencetak generasi unggul yang berkarakter, berakhlak mulia, dan berdaya saing global
              {founded ? ` sejak tahun ${founded}.` : '.'}
            </p>

            {/* Social Media */}
            {socialLinks.length > 0 ? (
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            ) : (
              // Tampil placeholder jika belum ada sosmed
              <div className="flex gap-3">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center opacity-40"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3">
              {setting?.address && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#FBBF24] flex-shrink-0" />
                  <span>{setting.address}</span>
                </li>
              )}
              {setting?.phone && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                  <span>{setting.phone}</span>
                </li>
              )}
              {setting?.email && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                  <span>{setting.email}</span>
                </li>
              )}
              {!setting && (
                <li className="text-sm text-slate-600 italic">Memuat kontak...</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} {schoolName}. Hak cipta dilindungi.</p>
          <p>Dibuat oleh Yokef Creative Studios</p>
        </div>
      </div>
    </footer>
  )
}