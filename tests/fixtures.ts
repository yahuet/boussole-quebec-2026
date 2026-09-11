// Données fictives pour les tests. Aucun parti réel, aucune position réelle.

import type { AxeId, Donnees, Position, Question, Sens, Valeur } from "../src/lib/types";

export const SIGLES = ["PA", "PB", "PC", "PD", "PE"];

export function position(valeur: Valeur | null): Position {
  if (valeur === null) return { valeur: null, statut: "non_documentee", motif: "aucune_source" };
  return {
    valeur,
    statut: "documentee",
    type_source: "plateforme",
    source: "https://exemple.test/source",
    date: "2026-09-01",
    consulte_le: "2026-09-11",
    extrait: "Extrait fictif.",
    nature_extrait: "citation",
    drapeaux: [],
  };
}

export function question(
  id: string,
  valeurs: (Valeur | null)[],
  axe: AxeId = "economique",
  sens: Sens = 1,
  theme = "t1",
): Question {
  return {
    id,
    theme,
    axe,
    sens,
    enonce: `Énoncé fictif ${id}.`,
    positions: Object.fromEntries(SIGLES.slice(0, valeurs.length).map((s, i) => [s, position(valeurs[i])])),
  };
}

export function donnees(questions: Question[], nbPartis = 5): Donnees {
  return {
    version: "0.0-test",
    date_mise_a_jour: "2026-09-11T12:00",
    date_declenchement: null,
    lance: false,
    partis: SIGLES.slice(0, nbPartis).map((s) => ({
      sigle: s,
      nom: `Parti ${s}`,
      le: `le ${s}`,
      du: `du ${s}`,
      chef: { nom: `Chef ${s}`, source: "https://exemple.test" },
    })),
    axes: [
      { id: "economique", libelle: "Économique", pole_negatif: "État", pole_positif: "Marché" },
      { id: "constitutionnel", libelle: "Constitutionnel", pole_negatif: "Fédéral", pole_positif: "Souveraineté" },
      { id: "identitaire", libelle: "Identitaire", pole_negatif: "Latitude", pole_positif: "Règles communes" },
    ],
    themes: [{ id: "t1", libelle: "Thème fictif", axe: "economique" }],
    questions,
  };
}
