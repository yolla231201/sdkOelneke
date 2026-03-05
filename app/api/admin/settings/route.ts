export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

const BUCKET = "assets_sdkOelneke"

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase env vars missing")
  return createClient(url, key, { auth: { persistSession: false } })
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const supabase = getSupabase()
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${folder}/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: true })

  if (error) throw error

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const fileType = formData.get("fileType") as string | null
    const dataRaw = formData.get("data")

    if (!dataRaw) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 400 })
    }

    const data = JSON.parse(dataRaw as string)

    let logoUrl: string | null = data.logo?.trim() || null
    let heroImageUrl: string | null = data.heroImage?.trim() || null

    if (file) {
      if (fileType === "logo") {
        logoUrl = await uploadFile(file, "logo")
      } else if (fileType === "heroImage") {
        heroImageUrl = await uploadFile(file, "hero")
      }
    }

    const { id, updatedAt, ...rest } = data

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        ...rest,
        logo: logoUrl,
        heroImage: heroImageUrl,
        updatedAt: new Date(),
      },
      create: {
        id: 1,
        ...rest,
        logo: logoUrl,
        heroImage: heroImageUrl,
      },
    })

    revalidatePath("/settings")
    revalidatePath("/")

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Settings POST Error:", error)
    return NextResponse.json(
      { message: "Gagal menyimpan data", error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
    })

    revalidatePath("/settings")
    revalidatePath("/")

    return NextResponse.json(settings || {})
  } catch (error: any) {
    console.error("Settings GET Error:", error)
    return NextResponse.json(
      { message: "Gagal mengambil data", error: error.message },
      { status: 500 }
    )
  }
}