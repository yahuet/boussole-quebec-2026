// Outil de travail (phase 2) : applique l'audit de neutralité à une sélection de questions candidates.
//
//   npx tsx scripts/analyser-selection.ts F3,F6,F2,S1,S2,S3,...
//
// Un code suivi de « ! » (ex. K1!) désigne la formulation inverse de la candidate :
// l'énoncé de remplacement est lu dans INVERSES, le sens et toutes les valeurs sont inversés
// (un parti qui appuie la mesure s'oppose à sa formulation inverse, avec la même source).

import { readFileSync } from "node:fs";
import { auditer } from "../src/lib/audit";
import type { Donnees, Position, Question } from "../src/lib/types";

export const INVERSES: Record<string, string> = {
  K1: "Le Québec devrait exclure la tenue d'un référendum sur la souveraineté au cours du prochain mandat.",
  Y3: "Le Québec devrait permettre les prières collectives dans les lieux publics extérieurs.",
  Y1: "Le Québec devrait permettre au personnel des services de garde subventionnés de porter des signes religieux.",
  S2: "L'État devrait payer davantage de chirurgies réalisées dans des cliniques privées.",
  V3: "Le Québec devrait permettre la vente de véhicules neufs à essence après 2035.",
};

function inverser(q: Question): Question {
  const enonce = INVERSES[q.id];
  if (!enonce) throw new Error(`Aucune formulation inverse définie pour ${q.id}`);
  const positions: Record<string, Position> = {};
  for (const [s, p] of Object.entries(q.positions)) {
    positions[s] =
      p.statut === "documentee"
        ? { ...p, valeur: (-p.valeur || 0) as typeof p.valeur, note: [p.note, "Valeur inversée : formulation inverse de la question source."].filter(Boolean).join(" — ") }
        : p;
  }
  return { ...q, id: `${q.id}i`, sens: (-q.sens as 1 | -1), enonce, positions };
}

const matrice = JSON.parse(readFileSync("recherche/matrice-candidats.json", "utf8")) as Donnees;
const codes = (process.argv[2] ?? "").split(",").map((c) => c.trim()).filter(Boolean);
const questions = codes.map((code) => {
  const inv = code.endsWith("!");
  const q = matrice.questions.find((x) => x.id === code.replace("!", ""));
  if (!q) throw new Error(`Code inconnu : ${code}`);
  return inv ? inverser(q) : q;
});

const selection: Donnees = { ...matrice, questions };
const rapport = auditer(selection, { simulations: 4000 });
for (const c of rapport.criteres) {
  console.log(`[${c.statut.toUpperCase()}] ${c.id} ${c.titre}`);
  for (const d of c.details) console.log(`    ${d}`);
}

// Part des énoncés que chaque parti appuie (valeur > 0), parmi ses positions documentées :
// c'est ce que mesure le profil « tout d'accord » (A4).
console.log("\nPart des énoncés appuyés (valeur > 0) / documentés :");
for (const p of matrice.partis) {
  const doc = questions.filter((q) => q.positions[p.sigle]?.statut === "documentee");
  const pour = doc.filter((q) => (q.positions[p.sigle].valeur ?? 0) > 0).length;
  const moyAbs = doc.reduce((s, q) => s + Math.abs(q.positions[p.sigle].valeur ?? 0), 0) / (doc.length || 1);
  console.log(`  ${p.sigle.padEnd(4)} ${pour}/${doc.length}   intensité moyenne |p| = ${moyAbs.toFixed(2)}`);
}
