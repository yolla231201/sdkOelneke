import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "react-hot-toast"

async function getSetting() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${base}/api/setting`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSetting()

  const title = setting?.schoolName ?? 'Website Sekolah'
  const description = setting?.tagline ?? 'Website Resmi Sekolah'

  return {
    title,
    description,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  )
}