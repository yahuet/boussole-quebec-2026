import { describe, expect, it } from "vitest";
import { genererExplication, texteIntegral } from "../src/lib/explication";
import { FORMULATIONS_INTERDITES } from "../src/lib/regles";
import type { Reponses, Valeur } from "../src/lib/types";
import { SIGLES, donnees, question } from "./fixtures";

const VALEURS: Valeur[] = [-2, -1, 0, 1, 2];

function aleatoire(graine: number) {
  let s = graine;
  return () => {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    return s / 2 ** 31;
  };
}

function jeuDeDonnees(graine: number) {
  const r = aleatoire(graine);
  const qs = Array.from({ length: 30 }, (_, i) =>
    question(
      `q${i + 1}`,
      SIGLES.map(() => (r() < 0.1 ? null : VALEURS[Math.floor(r() * 5)])),
      i < 21 ? "economique" : i < 24 ? "constitutionnel" : "identitaire",
      r() < 0.5 ? 1 : -1,
    ),
  );
  return donnees(qs);
}

function profil(graine: number, n: number): Reponses {
  const r = aleatoire(graine);
  const rep: Reponses = {};
  for (let i = 1; i <= n; i++) {
    rep[`q${i}`] = r() < 0.1 ? { choix: "sans_opinion", important: false } : { choix: VALEURS[Math.floor(r() * 5)], important: r() < 0.2 };
  }
  return rep;
}

describe("texte explicatif (§10)", () => {
  it("contient toujours la section des désaccords quand un résultat est calculé", () => {
    for (let g = 1; g <= 200; g++) {
      const ex = genererExplication(jeuDeDonnees(g), profil(g * 7, 30), { ordre: SIGLES, chef: "PC" });
      expect(ex.suffisant).toBe(true);
      const ids = ex.sections.map((s) => s.id);
      expect(ids).toContain("desaccords");
      expect(ids).toContain("rappel");
      const desaccords = ex.sections.find((s) => s.id === "desaccords");
      expect(desaccords?.blocs.length).toBeGreaterThan(0);
    }
  });

  it("n'emploie aucune formulation interdite (§10.3)", () => {
    for (let g = 1; g <= 200; g++) {
      const ex = genererExplication(jeuDeDonnees(g), profil(g * 13, 30), { ordre: SIGLES, chef: "PA" });
      const texte = texteIntegral(ex).toLowerCase();
      for (const f of FORMULATIONS_INTERDITES) expect(texte).not.toContain(f);
    }
  });

  it("contracte correctement « de le » en « du »", () => {
    for (let g = 1; g <= 100; g++) {
      const texte = texteIntegral(genererExplication(jeuDeDonnees(g), profil(g * 17, 30), { ordre: SIGLES, chef: "PB" }));
      expect(texte).not.toMatch(/\bde le\b/);
      expect(texte).not.toMatch(/\bde les\b/);
    }
  });

  it("produit le même texte pour les mêmes réponses", () => {
    const d = jeuDeDonnees(42);
    const p = profil(99, 30);
    const a = texteIntegral(genererExplication(d, p, { ordre: SIGLES }));
    const b = texteIntegral(genererExplication(d, p, { ordre: SIGLES }));
    expect(a).toBe(b);
  });

  it("refuse de calculer sous 10 réponses", () => {
    const ex = genererExplication(jeuDeDonnees(1), profil(3, 5), { ordre: SIGLES });
    expect(ex.suffisant).toBe(false);
    expect(ex.sections.map((s) => s.id)).toEqual(["tete", "rappel"]);
  });
});
