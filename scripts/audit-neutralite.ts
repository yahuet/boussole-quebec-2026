// Audit de neutralité — METHODOLOGIE.md, section 12.
//
//   npm run audit                    audite data/positions.json
//   npm run audit -- chemin.json     audite un autre fichier
//   npm run audit -- --rapport       écrit aussi data/audit-resultats.json (lu par la page méthodologie)
//
// Code de sortie 1 si un critère bloquant n'est pas respecté.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditer, type Statut } from "../src/lib/audit";
import type { Donnees } from "../src/lib/types";

const args = process.argv.slice(2);
const ecrireRapport = args.includes("--rapport");
const chemin = resolve(args.find((a) => !a.startsWith("--")) ?? "data/positions.json");

const donnees = JSON.parse(readFileSync(chemin, "utf8")) as Donnees;
const rapport = auditer(donnees);

const MARQUES: Record<Statut, string> = { ok: "[OK]    ", echec: "[ÉCHEC] ", alerte: "[ALERTE]", info: "[INFO]  " };

console.log(`Audit de neutralité — ${chemin}`);
console.log(`Données version ${rapport.version}, à jour au ${rapport.date_mise_a_jour} — ${rapport.lance ? "après le lancement" : "avant le lancement"}\n`);
for (const c of rapport.criteres) {
  console.log(`${MARQUES[c.statut]} ${c.id}  ${c.titre}${c.bloquant ? "  (bloquant)" : ""}`);
  for (const d of c.details) console.log(`           ${d}`);
}
console.log(`\n${rapport.reussi ? "Audit réussi : aucun critère bloquant en échec." : "Audit en échec : au moins un critère bloquant n'est pas respecté."}`);

if (ecrireRapport) {
  writeFileSync(resolve("data/audit-resultats.json"), JSON.stringify(rapport, null, 2) + "\n", "utf8");
  console.log("Rapport écrit dans data/audit-resultats.json");
}

process.exit(rapport.reussi ? 0 : 1);
