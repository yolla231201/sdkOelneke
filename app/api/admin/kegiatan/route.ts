import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

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

export async function GET() {
  try {
    const kegiatan = await prisma.kegiatan.findMany({
      orderBy: { tanggal: "desc" },
    })
    return NextResponse.json(kegiatan)
  } catch (error) {
    console.error("[GET]", error)
    return NextResponse.json({ error: "Gagal mengambil data kegiatan" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data = JSON.parse(formData.get("data") as string)
    const file = formData.get("file") as File | null

    const thumbnailUrl = file ? await uploadFile(file, "kegiatan") : undefined

    const kegiatan = await prisma.kegiatan.create({
      data: {
        judul: data.judul,
        deskripsi: data.deskripsi || null,
        lokasi: data.lokasi,
        tanggal: new Date(data.tanggal),
        thumbnail: thumbnailUrl ?? null,
      },
    })

    revalidatePath("/kegiatan")
    revalidatePath("/")

    return NextResponse.json(kegiatan, { status: 201 })
  } catch (error) {
    console.error("[POST]", error)
    return NextResponse.json({ error: "Gagal menyimpan kegiatan" }, { status: 500 })
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
      thumbnailUrl = await uploadFile(file, "kegiatan")
    }

    const updated = await prisma.kegiatan.update({
      where: { id: data.id },
      data: {
        judul: data.judul,
        deskripsi: data.deskripsi || null,
        lokasi: data.lokasi,
        tanggal: new Date(data.tanggal),
        thumbnail: thumbnailUrl,
      },
    })

    revalidatePath("/kegiatan")
    revalidatePath("/")

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PUT]", error)
    return NextResponse.json({ error: "Gagal update kegiatan" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    const kegiatan = await prisma.kegiatan.findUnique({ where: { id } })
    await deleteFromStorage(kegiatan?.thumbnail)
    await prisma.kegiatan.delete({ where: { id } })

    revalidatePath("/kegiatan")
    revalidatePath("/")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE]", error)
    return NextResponse.json({ error: "Gagal hapus kegiatan" }, { status: 500 })
  }
}