import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [totalBerita, totalGuru, totalKegiatan, recentBerita] = await Promise.all([
      prisma.berita.count(),
      prisma.guru.count(),
      prisma.kegiatan.count(),
      prisma.berita.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          judul: true,
          slug: true,
          status: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalBerita,
        totalGuru,
        totalKegiatan,
      },
      recentBerita,
    })
  } catch (error) {
    console.error("[DASHBOARD GET]", error)
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 })
  }
}