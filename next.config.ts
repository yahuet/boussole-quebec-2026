import type { NextConfig } from "next";

// Site entièrement statique : aucun serveur, aucune base de données, aucun cookie.
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
};

export default nextConfig;
