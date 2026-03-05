// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dzcaauepftbhiorrjagh.supabase.co", // sudah ada sebelumnya
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ← tambah ini
      },
    ],
  },
}

module.exports = nextConfig