// Outil de travail (phase 2) : assemble les fiches de recherche en une matrice de questions candidates.
//
//   npx tsx scripts/compiler-cellules.ts
//
// Lit recherche/candidats.md et recherche/cellules-<SIGLE>.md, écrit recherche/matrice-candidats.json
// et affiche, pour chaque candidate : la couverture, le pouvoir discriminant et les valeurs par parti.
// Ne décide rien : la sélection finale des 30 questions est validée par une personne.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { AxeId, Donnees, Drapeau, Position, Question, Sens, TypeSource, Valeur } from "../src/lib/types";

const SIGLES = ["CAQ", "PCQ", "PLQ", "PQ", "QS"];
const THEMES = [
  "fiscalite", "sante", "education", "economie", "environnement",
  "logement", "services_sociaux", "constitution", "immigration_langue", "laicite_identite",
];
const AXE_THEME: Record<string, AxeId> = {
  constitution: "constitutionnel",
  immigration_langue: "identitaire",
  laicite_identite: "identitaire",
};

interface Candidate {
  code: string;
  theme: string;
  axe: AxeId;
  sens: Sens;
  enonce: string;
}

/**
 * Fiches par thème de la troisième passe (recherche/theme-*.md), puis décisions de revue
 * du coordonnateur (recherche/revue.md), appliquées en dernier.
 */
const FICHES_THEME = [
  ...(existsSync("recherche")
    ? readdirSync("recherche").filter((f) => /^theme-.+\.md$/.test(f)).sort().map((f) => `recherche/${f}`)
    : []),
  ...(existsSync("recherche/revue.md") ? ["recherche/revue.md"] : []),
];

function lireCandidates(): Candidate[] {
  const texte = ["recherche/candidats.md", ...FICHES_THEME].map((f) => readFileSync(f, "utf8")).join("\n");
  const res: Candidate[] = [];
  let theme = "";
  for (const ligne of texte.split(/\r?\n/)) {
    const t = /^## (\d+)\./.exec(ligne);
    if (t) theme = THEMES[Number(t[1]) - 1];
    const c = /^- ([A-Z]\d+) \(([+−-]1)(?:, (constitutionnel))?\) (.+)$/.exec(ligne);
    if (c && theme && !res.some((x) => x.code === c[1])) {
      res.push({
        code: c[1],
        theme,
        axe: (c[3] as AxeId) ?? AXE_THEME[theme] ?? "economique",
        sens: c[2].startsWith("+") ? 1 : -1,
        enonce: c[4].trim(),
      });
    }
  }
  return res;
}

function nettoyer(v: string): string {
  return v.trim().replace(/^«\s*/, "").replace(/\s*»$/, "").trim();
}

function lireCellules(sigle: string): Record<string, Record<string, string>> {
  const chemin = `recherche/cellules-${sigle}.md`;
  if (!existsSync(chemin)) return {};
  const texte = readFileSync(chemin, "utf8");
  const blocs = texte.split(/^### /m).slice(1);
  const res: Record<string, Record<string, string>> = {};
  for (const bloc of blocs) {
    const [entete, ...lignes] = bloc.split(/\r?\n/);
    const code = /^([A-Z]\d+)\b/.exec(entete.trim())?.[1];
    if (!code) continue;
    const champs: Record<string, string> = {};
    for (const l of lignes) {
      const m = /^- ([a-z_]+)(?: \([^)]*\))?\s*:\s*(.*)$/.exec(l.trim());
      if (m) champs[m[1]] = m[2].trim();
    }
    res[code] = champs;
  }
  return res;
}

function versPosition(c: Record<string, string> | undefined): Position {
  if (!c) return { valeur: null, statut: "non_documentee", motif: "aucune_source", note: "Fiche absente." };
  const brut = (c.valeur ?? "").replace("−", "-").replace("+", "").trim();
  if (brut === "null" || brut === "") {
    const motif = (["aucune_source", "a_l_etude", "sources_contradictoires"].find((m) => (c.motif ?? "").includes(m)) ??
      "aucune_source") as "aucune_source";
    return { valeur: null, statut: "non_documentee", motif, note: c.note || c.justification || undefined };
  }
  const valeur = Number(brut) as Valeur;
  const drapeaux = (c.drapeaux ?? "")
    .split(/[,;]/)
    .map((d) => d.trim())
    .filter((d): d is Drapeau => ["anterieure_campagne", "anterieure_chef", "source_secondaire"].includes(d));
  return {
    valeur,
    statut: "documentee",
    type_source: (c.type_source?.trim() as TypeSource) ?? "declaration",
    source: c.source?.trim() ?? "",
    date: (c.date ?? "").trim().slice(0, 10),
    consulte_le: "2026-09-11",
    extrait: nettoyer(c.extrait ?? ""),
    nature_extrait: (c.nature_extrait ?? "").includes("paraphrase") ? "paraphrase" : "citation",
    drapeaux,
    note: [c.justification, c.note].filter(Boolean).join(" — ") || undefined,
  };
}

/** Entrées « ### CODE SIGLE » des fiches par thème ; elles complètent ou remplacent les fiches par parti. */
function lireFichesTheme(cellules: Record<string, Record<string, Record<string, string>>>) {
  for (const f of FICHES_THEME) {
    for (const bloc of readFileSync(f, "utf8").split(/^### /m).slice(1)) {
      const [entete, ...lignes] = bloc.split(/\r?\n/);
      const m = /^([A-Z]\d+)\s+(CAQ|PCQ|PLQ|PQ|QS)\b/.exec(entete.trim());
      if (!m) continue;
      const champs: Record<string, string> = {};
      for (const l of lignes) {
        const c = /^- ([a-z_]+)(?: \([^)]*\))?\s*:\s*(.*)$/.exec(l.trim());
        if (c) champs[c[1]] = c[2].trim();
      }
      cellules[m[2]][m[1]] = champs;
    }
  }
}

const candidates = lireCandidates();
const cellules = Object.fromEntries(SIGLES.map((s) => [s, lireCellules(s)]));
lireFichesTheme(cellules);
const questions: Question[] = candidates.map((c) => ({
  id: c.code,
  theme: c.theme,
  axe: c.axe,
  sens: c.sens,
  enonce: c.enonce,
  positions: Object.fromEntries(SIGLES.map((s) => [s, versPosition(cellules[s][c.code])])),
}));

const base = JSON.parse(readFileSync("data/positions.json", "utf8")) as Donnees;
writeFileSync("recherche/matrice-candidats.json", JSON.stringify({ ...base, questions }, null, 2) + "\n", "utf8");

const fmt = (p: Position) => (p.statut === "documentee" ? (p.valeur > 0 ? `+${p.valeur}` : `${p.valeur}`) : "·");
console.log(`Fiches lues : ${SIGLES.map((s) => `${s} ${Object.keys(cellules[s]).length}`).join(", ")}\n`);
console.log("code  sens  couv  discr  " + SIGLES.map((s) => s.padEnd(4)).join(" ") + "  énoncé");
for (const q of questions) {
  const vals = SIGLES.map((s) => q.positions[s]);
  const doc = vals.filter((p) => p.statut === "documentee") as Extract<Position, { statut: "documentee" }>[];
  const discr = doc.some((p) => p.valeur > 0) && doc.some((p) => p.valeur < 0);
  console.log(
    `${q.id.padEnd(5)} ${q.sens > 0 ? "+1" : "−1"}   ${doc.length}/5   ${discr ? "oui" : "non"}    ` +
      vals.map((p) => fmt(p).padEnd(4)).join(" ") +
      `  ${q.enonce.slice(0, 70)}`,
  );
}
