import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const berita = await prisma.berita.findFirst({
      where: {
        slug: params.slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        deskripsi: true,
        konten: true,
        thumbnail: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    })

    if (!berita) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(berita)
  } catch (error) {
    console.error("[GET /api/berita/[slug]]", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}