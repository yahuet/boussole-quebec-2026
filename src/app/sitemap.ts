import type { MetadataRoute } from "next";
import { donnees } from "@/lib/donnees";
import { URL_SITE } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = ["", "/boussole", "/methodologie", "/positions", "/partis", "/a-propos", "/credits"];

export default function sitemap(): MetadataRoute.Sitemap {
  const modifie = new Date(`${donnees.date_mise_a_jour.slice(0, 10)}T12:00:00-04:00`);
  return PAGES.map((p) => ({ url: `${URL_SITE}${p}`, lastModified: modifie }));
}
