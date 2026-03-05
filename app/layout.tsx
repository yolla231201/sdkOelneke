import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: 'Website Sekolah',
  description: 'Website Resmi Sekolah',
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