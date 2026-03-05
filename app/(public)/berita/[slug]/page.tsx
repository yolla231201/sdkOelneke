import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { CalendarDays, User, ArrowLeft } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type BeritaDetail = {
  id: number
  judul: string
  slug: string
  deskripsi: string | null
  konten: string
  thumbnail: string | null
  publishedAt: string | null
  createdAt: string
  author: { name: string }
}

type BeritaRelated = {
  id: number
  judul: string
  slug: string
  thumbnail: string | null
  publishedAt: string | null
  createdAt: string
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getBerita(slug: string): Promise<BeritaDetail | null> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/berita/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

async function getRelated(currentId: number): Promise<BeritaRelated[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${base}/api/berita?limit=4`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  const list: BeritaRelated[] = await res.json()
  return list.filter((b) => b.id !== currentId).slice(0, 3)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: { slug: string }
}

export default async function BeritaDetailPage({ params }: Props) {
  const berita = await getBerita(params.slug)
  if (!berita) notFound()

  const related = await getRelated(berita.id)

  const tanggal = new Date(berita.publishedAt ?? berita.createdAt).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 w-full">
        {berita.thumbnail ? (
          <Image
            src={berita.thumbnail}
            alt={berita.judul}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#1e40af]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white leading-tight">
              {berita.judul}
            </h1>
            <div className="flex flex-wrap gap-4 mt-3 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {tanggal}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {berita.author.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-[#1E3A8A] font-medium text-sm mb-8 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
        </Link>

        <div
          className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:text-[#1E3A8A] prose-p:leading-relaxed prose-p:text-slate-600"
          dangerouslySetInnerHTML={{ __html: berita.konten }}
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display font-bold text-2xl text-slate-800 mb-8">Berita Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/berita/${item.slug}`} className="group">
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-1">
                    {new Date(item.publishedAt ?? item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  <h3 className="font-display font-semibold text-slate-800 text-sm group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}