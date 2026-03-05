export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit")) || undefined

    const guru = await prisma.guru.findMany({
      select: {
        id: true,
        nama: true,
        jabatan: true,
        mapel: true,
        foto: true,
        bio: true,
        urutan: true,
      },
      orderBy: { urutan: "asc" },
      take: limit,
    })

    return NextResponse.json(guru)
  } catch (error) {
    console.error("[GET /api/guru]", error)
    return NextResponse.json({ error: "Gagal mengambil data guru" }, { status: 500 })
  }
}