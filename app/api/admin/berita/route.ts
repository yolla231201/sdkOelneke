import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

const BUCKET = "assets_sdkOelneke"

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function extractStoragePath(url: string): string | null {
  try {
    const pathname = new URL(url).pathname
    const marker = `/object/public/${BUCKET}/`
    const idx = pathname.indexOf(marker)
    return idx !== -1 ? pathname.slice(idx + marker.length) : null
  } catch {
    return null
  }
}

async function deleteFromStorage(url?: string | null) {
  if (!url) return
  const path = extractStoragePath(url)
  if (path) await getSupabase().storage.from(BUCKET).remove([path])
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = getSupabase()
  const buffer = Buffer.from(await file.arrayBuffer())
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase()
  const storagePath = `${folder}/${folder}-${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: file.type })

  if (error) throw new Error(`Upload gagal: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const berita = await prisma.berita.findMany({
      where: {
        ...(search && { judul: { contains: search, mode: "insensitive" } }),
        ...(status && { status: status as any }),
      },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(berita)
  } catch (error) {
    console.error("[GET]", error)
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data = JSON.parse(formData.get("data") as string)
    const file = formData.get("file") as File | null

    const thumbnailUrl = file ? await uploadFile(file, "berita") : undefined

    const slug = data.slug || generateSlug(data.judul)

    const existing = await prisma.berita.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan, gunakan slug lain" }, { status: 400 })
    }

    const berita = await prisma.berita.create({
      data: {
        judul: data.judul,
        slug,
        deskripsi: data.deskripsi || null,
        konten: data.konten,
        thumbnail: thumbnailUrl ?? null,
        status: data.status || "DRAFT",
        publishedAt: data.status === "PUBLISHED" ? new Date(data.publishedAt || Date.now()) : null,
        authorId: Number(data.authorId),
      },
    })

    return NextResponse.json(berita, { status: 201 })
  } catch (error) {
    console.error("[POST]", error)
    return NextResponse.json({ error: "Gagal menyimpan berita" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const data = JSON.parse(formData.get("data") as string)
    const file = formData.get("file") as File | null

    let thumbnailUrl: string | null = data.thumbnail ?? null

    if (file) {
      await deleteFromStorage(data.thumbnail)
      thumbnailUrl = await uploadFile(file, "berita")
    }

    if (data.slug) {
      const existing = await prisma.berita.findFirst({
        where: { slug: data.slug, NOT: { id: data.id } },
      })
      if (existing) {
        return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 })
      }
    }

    const updated = await prisma.berita.update({
      where: { id: data.id },
      data: {
        judul: data.judul,
        slug: data.slug,
        deskripsi: data.deskripsi || null,
        konten: data.konten,
        thumbnail: thumbnailUrl,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date(data.publishedAt || Date.now()) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PUT]", error)
    return NextResponse.json({ error: "Gagal update berita" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    const berita = await prisma.berita.findUnique({ where: { id } })
    await deleteFromStorage(berita?.thumbnail)
    await prisma.berita.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE]", error)
    return NextResponse.json({ error: "Gagal hapus berita" }, { status: 500 })
  }
}