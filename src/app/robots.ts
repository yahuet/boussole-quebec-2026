import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/boussole/resultats" },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
