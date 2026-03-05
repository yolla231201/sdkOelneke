export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit")) || undefined

    const kegiatan = await prisma.kegiatan.findMany({
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        thumbnail: true,
        tanggal: true,
        lokasi: true,
      },
      orderBy: { tanggal: "desc" },
      take: limit,
    })

    return NextResponse.json(kegiatan)
  } catch (error) {
    console.error("[GET /api/kegiatan]", error)
    return NextResponse.json({ error: "Gagal mengambil data kegiatan" }, { status: 500 })
  }
}