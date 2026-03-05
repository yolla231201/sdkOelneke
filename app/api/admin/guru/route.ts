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
    const guru = await prisma.guru.findMany({ orderBy: { urutan: "asc" } })
    return NextResponse.json(guru)
  } catch (error) {
    console.error("[GET]", error)
    return NextResponse.json({ error: "Gagal mengambil data guru" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data = JSON.parse(formData.get("data") as string)
    const file = formData.get("file") as File | null

    const fotoUrl = file ? await uploadFile(file, "guru") : undefined

    const guru = await prisma.guru.create({
      data: {
        nama: data.nama,
        jabatan: data.jabatan || null,
        mapel: data.mapel || null,
        urutan: Number(data.urutan) || 0,
        bio: data.bio || null,
        foto: fotoUrl ?? null,
      },
    })

    revalidatePath("/guru")
    revalidatePath("/")

    return NextResponse.json(guru, { status: 201 })
  } catch (error) {
    console.error("[POST]", error)
    return NextResponse.json({ error: "Gagal menyimpan guru" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()
    const data = JSON.parse(formData.get("data") as string)
    const file = formData.get("file") as File | null

    let fotoUrl: string | null = data.foto ?? null

    if (file) {
      await deleteFromStorage(data.foto)
      fotoUrl = await uploadFile(file, "guru")
    }

    const updated = await prisma.guru.update({
      where: { id: data.id },
      data: {
        nama: data.nama,
        jabatan: data.jabatan || null,
        mapel: data.mapel || null,
        urutan: Number(data.urutan) || 0,
        bio: data.bio || null,
        foto: fotoUrl,
      },
    })

    revalidatePath("/guru")
    revalidatePath("/")

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[PUT]", error)
    return NextResponse.json({ error: "Gagal update guru" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    const guru = await prisma.guru.findUnique({ where: { id } })
    await deleteFromStorage(guru?.foto)
    await prisma.guru.delete({ where: { id } })

    revalidatePath("/guru")
    revalidatePath("/")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE]", error)
    return NextResponse.json({ error: "Gagal hapus guru" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { items } = await req.json()

    await Promise.all(
      (items as { id: number }[]).map((item, index) =>
        prisma.guru.update({
          where: { id: item.id },
          data: { urutan: index },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PATCH]", error)
    return NextResponse.json({ error: "Gagal update urutan" }, { status: 500 })
  }
}