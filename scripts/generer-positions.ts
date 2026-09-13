// Outil de travail (phase 2) : produit data/positions.json à partir de la sélection validée.
//
//   npx tsx scripts/generer-positions.ts
//
// Lit recherche/matrice-candidats.json et recherche/selection.json :
//   { "version": "0.9-brouillon", "questions": [ { "code": "K1", "inverse": true, "enonce": "…", "contexte": "…", "contexte_source": "…" }, … ] }
// Attribue les identifiants q01…q30 selon un ordre qui respecte la section 2.4 de la méthodologie :
//   - jamais trois questions du même thème de suite ;
//   - jamais plus de deux questions consécutives du même axe et du même sens ;
//   - aucune question de laïcité ni de question constitutionnelle dans les 5 premières.
// L'ordre est déterministe (graine fixe) : il ne dépend pas des positions des partis.

import { readFileSync, writeFileSync } from "node:fs";
import { generateur } from "../src/lib/audit";
import type { Donnees, Position, Question } from "../src/lib/types";

interface Choix {
  code: string;
  inverse?: boolean;
  enonce?: string;
  contexte?: string;
  contexte_source?: string;
}

const matrice = JSON.parse(readFileSync("recherche/matrice-candidats.json", "utf8")) as Donnees;
const selection = JSON.parse(readFileSync("recherche/selection.json", "utf8")) as { version: string; questions: Choix[] };
const base = JSON.parse(readFileSync("data/positions.json", "utf8")) as Donnees;

function preparer(c: Choix): Question {
  const q = matrice.questions.find((x) => x.id === c.code);
  if (!q) throw new Error(`Code inconnu : ${c.code}`);
  const positions: Record<string, Position> = {};
  for (const [s, p] of Object.entries(q.positions)) {
    positions[s] =
      c.inverse && p.statut === "documentee"
        ? {
            ...p,
            valeur: (0 - p.valeur) as typeof p.valeur,
            note: [p.note, "Valeur de signe inversé : l'énoncé est formulé à partir du pôle opposé à celui de la mesure citée."]
              .filter(Boolean)
              .join(" — "),
          }
        : p;
  }
  if (c.inverse && !c.enonce) throw new Error(`${c.code} : un énoncé est requis pour une formulation inverse`);
  return {
    id: c.code,
    theme: q.theme,
    axe: q.axe,
    sens: (c.inverse ? -q.sens : q.sens) as 1 | -1,
    enonce: c.enonce ?? q.enonce,
    ...(c.contexte ? { contexte: c.contexte, contexte_source: c.contexte_source } : {}),
    positions,
  };
}

const questions = selection.questions.map(preparer);

function valide(ordre: Question[]): boolean {
  for (let i = 0; i < ordre.length; i++) {
    const q = ordre[i];
    if (i < 5 && (q.theme === "laicite_identite" || q.theme === "constitution")) return false;
    if (i >= 2) {
      const [a, b] = [ordre[i - 2], ordre[i - 1]];
      if (a.theme === q.theme && b.theme === q.theme) return false;
      if (a.axe === q.axe && b.axe === q.axe && a.sens === q.sens && b.sens === q.sens) return false;
    }
  }
  return true;
}

const alea = generateur(20261005);
let ordre: Question[] | null = null;
for (let essai = 0; essai < 200000 && !ordre; essai++) {
  const t = [...questions];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  if (valide(t)) ordre = t;
}
if (!ordre) throw new Error("Aucun ordre ne respecte la section 2.4 : revoir la sélection.");

const finales = ordre.map((q, i) => ({ ...q, id: `q${String(i + 1).padStart(2, "0")}`, code_recherche: q.id }));
const maintenant = new Date();
const date = `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, "0")}-${String(maintenant.getDate()).padStart(2, "0")}T${String(maintenant.getHours()).padStart(2, "0")}:${String(maintenant.getMinutes()).padStart(2, "0")}`;

writeFileSync(
  "data/positions.json",
  JSON.stringify({ ...base, version: selection.version, date_mise_a_jour: date, questions: finales }, null, 2) + "\n",
  "utf8",
);
console.log(`data/positions.json écrit : ${finales.length} questions, version ${selection.version}.`);
for (const q of finales) console.log(`${q.id}  ${q.code_recherche.padEnd(5)} ${q.theme.padEnd(18)} ${q.sens > 0 ? "+1" : "−1"}  ${q.enonce}`);
