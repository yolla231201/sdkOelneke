import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "react-hot-toast"
import { prisma } from "@/lib/prisma"

async function getSetting() {
  try {
    return await prisma.settings.findUnique({ where: { id: 1 } })
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSetting()

  return {
    title: setting?.schoolName ?? 'Website Sekolah',
    description: setting?.tagline ?? 'Website Resmi Sekolah',
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