import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ♿ SSG — output: "export" gera HTML estático puro em build time.
  // O site funciona sem servidor Node.js — pode ser hospedado em qualquer CDN/S3.
  // Benefício a11y: conteúdo disponível imediatamente, sem depender de JS.
  output: "export",

  // Permite carregar imagens do Unsplash via next/image
  images: {
    unoptimized: true, // Necessário para output: "export" (sem servidor de imagens)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
