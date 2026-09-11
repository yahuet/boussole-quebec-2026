// Jeu de données FICTIF, pour le développement de l'interface seulement.
// Partis, chefs, énoncés et positions sont inventés. Ce jeu ne peut pas être déployé (voir donnees.ts).

import type { AxeId, Donnees, Position, Question, Sens, Valeur } from "./types";

const THEMES: [string, string, AxeId][] = [
  ["fiscalite", "Fiscalité et finances publiques", "economique"],
  ["sante", "Santé", "economique"],
  ["education", "Éducation", "economique"],
  ["economie", "Économie et réglementation des entreprises", "economique"],
  ["environnement", "Environnement et énergie", "economique"],
  ["logement", "Logement et habitation", "economique"],
  ["services_sociaux", "Services sociaux et organismes communautaires", "economique"],
  ["constitution", "Question constitutionnelle", "constitutionnel"],
  ["immigration_langue", "Immigration et langue", "identitaire"],
  ["laicite_identite", "Laïcité et identité", "identitaire"],
];

const SIGLES = ["PA", "PB", "PC", "PD", "PE"];

function alea(graine: number) {
  let s = graine;
  return () => {
    s = (s * 1103515245 + 12345) % 2 ** 31;
    return s / 2 ** 31;
  };
}

export function donneesDemo(): Donnees {
  const r = alea(7);
  const valeurs: Valeur[] = [-2, -1, 0, 1, 2];
  const questions: Question[] = [];
  THEMES.forEach(([id, libelle, axe], t) => {
    for (let k = 0; k < 3; k++) {
      const n = t * 3 + k + 1;
      const sens: Sens = (k === 1) !== (t % 2 === 0) ? 1 : -1;
      const positions: Record<string, Position> = {};
      for (const s of SIGLES) {
        positions[s] =
          r() < 0.08
            ? { valeur: null, statut: "non_documentee", motif: "aucune_source" }
            : {
                valeur: valeurs[Math.floor(r() * 5)],
                statut: "documentee",
                type_source: "plateforme",
                source: "https://exemple.invalid/source-fictive",
                date: "2026-09-01",
                consulte_le: "2026-09-11",
                extrait: "Extrait fictif de démonstration.",
                nature_extrait: "citation",
                drapeaux: r() < 0.2 ? ["anterieure_campagne"] : [],
              };
      }
      questions.push({
        id: `q${String(n).padStart(2, "0")}`,
        theme: id,
        axe,
        sens,
        enonce: `[FICTIF] Énoncé de démonstration n° ${n} (${libelle.toLowerCase()}).`,
        contexte: k === 0 ? "Note de contexte fictive, pour vérifier l'affichage." : undefined,
        positions,
      });
    }
  });
  return {
    version: "demo",
    date_mise_a_jour: "2026-09-11T12:00",
    date_declenchement: "2026-09-01",
    lance: false,
    partis: SIGLES.map((s) => ({
      sigle: s,
      nom: `Parti fictif ${s.slice(1)}`,
      le: `le parti ${s.slice(1)}`,
      du: `du parti ${s.slice(1)}`,
      chef: { nom: `Chef fictif ${s.slice(1)}`, source: "https://exemple.invalid" },
    })),
    axes: [
      { id: "economique", libelle: "Axe économique", pole_negatif: "Rôle accru de l'État", pole_positif: "Rôle accru du marché" },
      { id: "constitutionnel", libelle: "Axe constitutionnel", pole_negatif: "Cadre fédéral", pole_positif: "Souveraineté du Québec" },
      { id: "identitaire", libelle: "Axe identitaire", pole_negatif: "Latitude individuelle", pole_positif: "Règles communes" },
    ],
    themes: THEMES.map(([id, libelle, axe]) => ({ id, libelle, axe })),
    questions,
  };
}
