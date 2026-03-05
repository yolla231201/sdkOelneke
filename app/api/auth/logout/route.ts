import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Hapus cookie di browser
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),  // ← expire di masa lalu = browser hapus cookie
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[POST /api/auth/logout]", error)
    return NextResponse.json({ error: "Gagal logout" }, { status: 500 })
  }
}