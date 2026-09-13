import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const infos = JSON.parse(readFileSync("data/partis.json", "utf8")) as {
  mots_par_resume: number;
  resumes: Record<string, { texte: string; source: string }[]>;
  fiches: Record<string, { titre_chef: string; site_officiel: string }>;
};
const positions = JSON.parse(readFileSync("data/positions.json", "utf8")) as { partis: { sigle: string }[] };

/** Un mot = une suite de caractères contenant au moins une lettre ou un chiffre (« % » et « » » ne comptent pas). */
const mots = (t: string) => t.split(/\s+/).filter((m) => /[0-9A-Za-zÀ-ÿŒœ]/.test(m)).length;

describe("fiches des partis (plan de design, section 5)", () => {
  it("ont un résumé pour chacun des cinq partis, et seulement pour eux", () => {
    expect(Object.keys(infos.resumes).sort()).toEqual(positions.partis.map((p) => p.sigle).sort());
    expect(Object.keys(infos.fiches).sort()).toEqual(positions.partis.map((p) => p.sigle).sort());
  });

  it("ont exactement le même nombre de mots pour les cinq partis", () => {
    for (const [sigle, phrases] of Object.entries(infos.resumes)) {
      expect(mots(phrases.map((p) => p.texte).join(" ")), sigle).toBe(infos.mots_par_resume);
    }
  });

  it("lient chaque phrase à une source web", () => {
    for (const phrases of Object.values(infos.resumes)) {
      for (const p of phrases) expect(p.source).toMatch(/^https:\/\//);
    }
  });
});

describe("portraits (étape D)", () => {
  const credits = JSON.parse(readFileSync("data/credits.json", "utf8")) as {
    images: { fichier: string; sigle: string; auteur: string; licence: string; source: string }[];
  };
  const portraits = credits.images.filter((i) => i.fichier.startsWith("portraits/"));

  it("couvrent les cinq partis ou aucun", () => {
    expect([0, positions.partis.length]).toContain(portraits.length);
  });

  it("ont tous un auteur, une licence libre et une source", () => {
    for (const p of portraits) {
      expect(p.auteur.trim(), p.sigle).not.toBe("");
      expect(p.licence, p.sigle).toMatch(/^(CC BY|CC BY-SA|CC0|Domaine public)/);
      expect(p.source, p.sigle).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });
});
