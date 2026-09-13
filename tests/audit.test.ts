import { describe, expect, it } from "vitest";
import { auditer } from "../src/lib/audit";
import type { AxeId, Donnees, Sens, Valeur } from "../src/lib/types";
import { SIGLES, donnees, question } from "./fixtures";

const THEMES = [
  ["fiscalite", "economique"], ["sante", "economique"], ["education", "economique"],
  ["economie", "economique"], ["environnement", "economique"], ["logement", "economique"],
  ["services_sociaux", "economique"], ["constitution", "constitutionnel"],
  ["immigration_langue", "identitaire"], ["laicite_identite", "identitaire"],
] as const;

/** 30 questions structurellement conformes ; `positions(i)` donne les valeurs des cinq partis. */
function jeu(positions: (i: number) => (Valeur | null)[]): Donnees {
  const qs = THEMES.flatMap(([theme, axe], t) =>
    [0, 1, 2].map((k) => {
      const i = t * 3 + k;
      const sens: Sens = (k === 1) !== (t % 2 === 0) ? 1 : -1;
      return question(`q${i + 1}`, positions(i), axe as AxeId, sens, theme);
    }),
  );
  const d = donnees(qs);
  d.themes = THEMES.map(([id, axe]) => ({ id, libelle: id, axe: axe as AxeId }));
  return d;
}

const statut = (d: Donnees, id: string) => auditer(d, { simulations: 500 }).criteres.find((c) => c.id === id);

describe("audit de neutralité (§12)", () => {
  it("accepte un jeu équilibré sur la structure (A1 à A3)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => ((i + k) % 2 === 0 ? 2 : -2)));
    expect(statut(d, "A1")?.statut).toBe("ok");
    expect(statut(d, "A2")?.statut).toBe("ok");
    expect(statut(d, "A3")?.statut).toBe("ok");
  });

  it("détecte un parti favorisé par le profil « tout d'accord » (A4)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => (k === 0 ? 2 : (i + k) % 2 === 0 ? 2 : -2)));
    const a4 = statut(d, "A4");
    expect(a4?.statut).toBe("echec");
    expect(a4?.bloquant).toBe(true);
  });

  it("devient une alerte publique après le lancement (A4)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => (k === 0 ? 2 : (i + k) % 2 === 0 ? 2 : -2)));
    d.lance = true;
    const a4 = statut(d, "A4");
    expect(a4?.statut).toBe("alerte");
    expect(a4?.bloquant).toBe(false);
  });

  it("détecte un mot évaluatif ou un nom de parti dans un énoncé (A6)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => ((i + k) % 2 === 0 ? 2 : -2)));
    d.questions[0].enonce = "L'État devrait réduire les dépenses excessives.";
    d.questions[1].enonce = "Le PA devrait être appuyé.";
    const a6 = statut(d, "A6");
    expect(a6?.statut).toBe("echec");
    expect(a6?.details.join(" ")).toContain("excessives");
    expect(a6?.details.join(" ")).toContain("PA");
  });

  it("accepte un thème incomplet seulement avec une note publique (A1, version 1.1)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => ((i + k) % 2 === 0 ? 2 : -2)));
    d.questions = d.questions.filter((q) => q.theme !== "services_sociaux");
    expect(statut(d, "A1")?.statut).toBe("echec");
    d.themes = d.themes.map((t) => (t.id === "services_sociaux" ? { ...t, note_couverture: "Aucune mesure ne départage 4 partis." } : t));
    expect(statut(d, "A1")?.statut).toBe("ok");
  });

  it("exige une question couverte par au moins 4 partis (A5a)", () => {
    const d = jeu((i) => SIGLES.map((_, k) => (i === 0 && k < 2 ? null : (i + k) % 2 === 0 ? 2 : -2)));
    expect(statut(d, "A5a")?.statut).toBe("echec");
  });
});
