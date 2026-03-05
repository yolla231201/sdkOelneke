export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit")) || undefined

    const berita = await prisma.berita.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        judul: true,
        slug: true,
        deskripsi: true,
        thumbnail: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(berita)
  } catch (error) {
    console.error("[GET /api/berita]", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}