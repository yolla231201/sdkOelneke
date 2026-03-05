export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"



export async function GET() {
  try {
    // Settings selalu 1 row dengan id = 1
    const setting = await prisma.settings.findUnique({
      where: { id: 1 },
    })

    if (!setting) {
      // Return default jika belum ada data di DB
      return NextResponse.json({
        schoolName: "Nama Sekolah",
        shortName: "Nama Singkat",
        tagline: "Tagline Sekolah",
        founded: "-",
        akreditasi: "A",
        siswaAktif: "-",
        prestasi: "-",
        address: "-",
        phone: "-",
        email: "-",
        logo: null,
        heroImage: null,
      })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error("[GET /api/setting]", error)
    return NextResponse.json({ error: "Gagal mengambil data setting" }, { status: 500 })
  }
}