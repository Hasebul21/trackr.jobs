import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's runtime can't be bundled into the Next.js Server Component
  // graph cleanly — keep it external so the engine binaries / pg driver
  // resolve at runtime on Vercel.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  images: {
    // Company logos come from Clearbit; the rest are full URLs from the
    // job providers themselves. Allow https from anywhere — these are
    // <img> tags today (next/image is opt-in per use), so this only
    // applies if a future component switches to next/image.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    // Larger payloads from the cron route (full ingest report).
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
