// Audit de neutralité (METHODOLOGIE.md, section 12).
// Chaque critère renvoie un résultat ; le script scripts/audit-neutralite.ts les affiche
// et échoue si un critère bloquant n'est pas respecté.

import {
  arrondir,
  calculerProximites,
  estDocumentee,
  formerGroupes,
  type ResultatParti,
} from "./calcul";
import { genererExplication, texteIntegral } from "./explication";
import { FORMULATIONS_INTERDITES, MOTIF_NUMERO_LOI, MOTS_A_RELIRE, MOTS_EVALUATIFS } from "./regles";
import {
  THEME_EXCEPTION_CONSTITUTIONNEL,
  type AxeId,
  type Donnees,
  type Reponses,
  type Valeur,
} from "./types";

export type Statut = "ok" | "echec" | "alerte" | "info";

export interface ResultatCritere {
  id: string;
  titre: string;
  statut: Statut;
  /** true si un échec de ce critère bloque la publication dans la phase actuelle. */
  bloquant: boolean;
  details: string[];
  mesures?: Record<string, unknown>;
}

export interface RapportAudit {
  version: string;
  date_mise_a_jour: string;
  lance: boolean;
  execute_le: string;
  criteres: ResultatCritere[];
  reussi: boolean;
}

export const NB_THEMES = 10;
export const QUESTIONS_PAR_THEME = 3;
export const SEUIL_ECART_PROFILS = 4; // A4 : 4 points ou moins
export const SIMULATIONS = 20000; // A5b
export const SEUIL_ECART_MOYEN = 2; // A5b : points
export const SEUIL_FREQUENCE_TETE = 5; // A5b : points de pourcentage
export const GRAINE = 20261005; // graine fixe : l'audit est reproductible

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function generateur(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VALEURS: Valeur[] = [-2, -1, 0, 1, 2];
const AXES: AxeId[] = ["economique", "constitutionnel", "identitaire"];

function critere(
  id: string,
  titre: string,
  ok: boolean,
  bloquant: boolean,
  details: string[],
  mesures?: Record<string, unknown>,
  siEchec: Statut = "echec",
): ResultatCritere {
  return { id, titre, statut: ok ? "ok" : siEchec, bloquant: !ok && bloquant, details, mesures };
}

// --- A1 : questions par thème ---
function a1(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = d.themes.length === NB_THEMES && d.questions.length === NB_THEMES * QUESTIONS_PAR_THEME;
  if (d.themes.length !== NB_THEMES) details.push(`${d.themes.length} thèmes au lieu de ${NB_THEMES}.`);
  const comptes: Record<string, number> = {};
  for (const t of d.themes) {
    const n = d.questions.filter((q) => q.theme === t.id).length;
    comptes[t.id] = n;
    if (n !== QUESTIONS_PAR_THEME) {
      ok = false;
      details.push(`${t.libelle} : ${n} question(s) au lieu de ${QUESTIONS_PAR_THEME}.`);
    }
  }
  const orphelines = d.questions.filter((q) => !d.themes.some((t) => t.id === q.theme));
  if (orphelines.length > 0) {
    ok = false;
    details.push(`Questions sans thème connu : ${orphelines.map((q) => q.id).join(", ")}.`);
  }
  return critere("A1", "Questions par thème", ok, true, details, { total: d.questions.length, comptes });
}

// --- A2 : questions par axe ---
function a2(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = true;
  const comptes = Object.fromEntries(AXES.map((a) => [a, d.questions.filter((q) => q.axe === a).length]));
  if (comptes.economique !== 21) {
    ok = false;
    details.push(`Axe économique : ${comptes.economique} questions au lieu de 21.`);
  }
  if (comptes.constitutionnel < 3 || comptes.constitutionnel > 4) {
    ok = false;
    details.push(`Axe constitutionnel : ${comptes.constitutionnel} questions (attendu : 3 ou 4).`);
  }
  for (const q of d.questions) {
    const theme = d.themes.find((t) => t.id === q.theme);
    if (!theme || theme.axe === q.axe) continue;
    if (q.theme === THEME_EXCEPTION_CONSTITUTIONNEL && q.axe === "constitutionnel") {
      details.push(`À relire : ${q.id} (immigration et langue) est classée sur l'axe constitutionnel. Porte-t-elle sur le partage des compétences ?`);
    } else {
      ok = false;
      details.push(`${q.id} : axe « ${q.axe} » incompatible avec son thème « ${theme.libelle} ».`);
    }
  }
  return critere("A2", "Questions par axe", ok, true, details, comptes);
}

// --- A3 : répartition du sens ---
function a3(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = true;
  const mesures: Record<string, string> = {};
  for (const axe of AXES) {
    const qs = d.questions.filter((q) => q.axe === axe);
    const plus = qs.filter((q) => q.sens === 1).length;
    const moins = qs.length - plus;
    mesures[axe] = `${plus} × (+1), ${moins} × (−1)`;
    if (Math.abs(plus - moins) > 1) {
      ok = false;
      details.push(`Axe ${axe} : ${plus} questions de sens +1 et ${moins} de sens −1 (écart > 1).`);
    }
  }
  for (const t of d.themes) {
    const sens = new Set(d.questions.filter((q) => q.theme === t.id).map((q) => q.sens));
    if (sens.size < 2 && d.questions.some((q) => q.theme === t.id)) {
      ok = false;
      details.push(`${t.libelle} : toutes les questions ont le même sens.`);
    }
  }
  const plus = d.questions.filter((q) => q.sens === 1).length;
  const moins = d.questions.length - plus;
  mesures.ensemble = `${plus} × (+1), ${moins} × (−1)`;
  if (Math.abs(plus - moins) > 2) {
    ok = false;
    details.push(`Ensemble : ${plus} questions de sens +1 et ${moins} de sens −1 (écart > 2).`);
  }
  return critere("A3", "Répartition du sens", ok, true, details, mesures);
}

function profilUniforme(d: Donnees, v: Valeur): Reponses {
  return Object.fromEntries(d.questions.map((q) => [q.id, { choix: v, important: false }]));
}

function scoresProfil(d: Donnees, v: Valeur): Record<string, number | null> {
  return Object.fromEntries(
    calculerProximites(d, profilUniforme(d, v)).map((r) => [r.sigle, r.score === null ? null : arrondir(r.score)]),
  );
}

// --- A4 : profils uniformes ---
function a4(d: Donnees): ResultatCritere[] {
  const details: string[] = [];
  const mesures: Record<string, Record<string, number | null>> = {};
  let ok = true;
  for (const v of [2, -2, 0] as Valeur[]) {
    const scores = scoresProfil(d, v);
    mesures[`tout ${v > 0 ? "+" : ""}${v}`] = scores;
    const valeurs = Object.values(scores).filter((x): x is number => x !== null);
    const ecart = valeurs.length > 0 ? Math.max(...valeurs) - Math.min(...valeurs) : 0;
    const texte = Object.entries(scores).map(([s, x]) => `${s} ${x ?? "—"}`).join(", ");
    details.push(`Profil « tout ${v > 0 ? "+" : ""}${v} » : ${texte} (écart ${ecart} points).`);
    if (ecart > SEUIL_ECART_PROFILS) ok = false;
  }
  const info: Record<string, Record<string, number | null>> = {};
  const detailsInfo: string[] = [];
  for (const v of [1, -1] as Valeur[]) {
    const scores = scoresProfil(d, v);
    info[`tout ${v > 0 ? "+" : ""}${v}`] = scores;
    detailsInfo.push(`Profil « tout ${v > 0 ? "+" : ""}${v} » : ${Object.entries(scores).map(([s, x]) => `${s} ${x ?? "—"}`).join(", ")}.`);
  }
  return [
    critere("A4", "Profils uniformes (tout +2, tout −2, tout 0)", ok, !d.lance, details, mesures, d.lance ? "alerte" : "echec"),
    { id: "A4b", titre: "Profils « tout +1 » et « tout −1 »", statut: "info", bloquant: false, details: detailsInfo, mesures: info },
  ];
}

// --- A5a : couverture ---
function a5a(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = true;
  for (const q of d.questions) {
    const documentees = d.partis.filter((p) => estDocumentee(q.positions[p.sigle])).length;
    if (documentees < 4) {
      ok = false;
      details.push(`${q.id} : ${documentees} position(s) documentée(s) sur ${d.partis.length} (minimum 4).`);
    }
  }
  const parParti = Object.fromEntries(
    d.partis.map((p) => [p.sigle, d.questions.filter((q) => !estDocumentee(q.positions[p.sigle])).length]),
  );
  details.push(`Positions non documentées par parti : ${Object.entries(parParti).map(([s, n]) => `${s} ${n}`).join(", ")}.`);
  return critere("A5a", "Couverture des positions", ok, !d.lance, details, parParti, d.lance ? "alerte" : "echec");
}

function profilAleatoire(d: Donnees, alea: () => number): Reponses {
  const r: Reponses = {};
  for (const q of d.questions) {
    if (alea() < 0.1) r[q.id] = { choix: "sans_opinion", important: false };
    else r[q.id] = { choix: VALEURS[Math.floor(alea() * 5)], important: alea() < 0.2 };
  }
  return r;
}

/**
 * A5b compare deux façons de calculer : le seuil d'affichage (§6.5) n'y joue pas.
 * Sinon, une base commune de moins de 10 questions masquerait tous les scores et ferait échouer le test par construction.
 */
function sansSeuil(resultats: ResultatParti[]): ResultatParti[] {
  return resultats.map((r) => ({ ...r, affiche: r.score !== null, arrondi: r.score === null ? null : arrondir(r.score) }));
}

// --- A5b : effet des positions non documentées ---
function a5b(d: Donnees, simulations: number): ResultatCritere {
  const commune: Donnees = {
    ...d,
    questions: d.questions.filter((q) => d.partis.every((p) => estDocumentee(q.positions[p.sigle]))),
  };
  const sigles = d.partis.map((p) => p.sigle);
  const sommeEcart = Object.fromEntries(sigles.map((s) => [s, 0]));
  const nbEcart = Object.fromEntries(sigles.map((s) => [s, 0]));
  const teteNormale = Object.fromEntries(sigles.map((s) => [s, 0]));
  const teteCommune = Object.fromEntries(sigles.map((s) => [s, 0]));
  const alea = generateur(GRAINE);

  for (let i = 0; i < simulations; i++) {
    const profil = profilAleatoire(d, alea);
    const normal = sansSeuil(calculerProximites(d, profil));
    const base = sansSeuil(calculerProximites(commune, profil));
    for (const s of sigles) {
      const x = normal.find((r) => r.sigle === s)?.score;
      const y = base.find((r) => r.sigle === s)?.score;
      if (x != null && y != null) {
        sommeEcart[s] += x - y;
        nbEcart[s] += 1;
      }
    }
    for (const s of formerGroupes(normal)[0] ?? []) teteNormale[s] += 1;
    for (const s of formerGroupes(base)[0] ?? []) teteCommune[s] += 1;
  }

  const details: string[] = [
    `${simulations} profils aléatoires (graine ${GRAINE}) ; base commune : ${commune.questions.length} questions documentées pour les cinq partis.`,
  ];
  let ok = true;
  const mesures: Record<string, unknown> = {};
  for (const s of sigles) {
    const ecartMoyen = nbEcart[s] > 0 ? sommeEcart[s] / nbEcart[s] : 0;
    const fN = (100 * teteNormale[s]) / simulations;
    const fC = (100 * teteCommune[s]) / simulations;
    mesures[s] = { ecart_moyen: Number(ecartMoyen.toFixed(2)), tete_normale: Number(fN.toFixed(1)), tete_commune: Number(fC.toFixed(1)) };
    const echec = Math.abs(ecartMoyen) > SEUIL_ECART_MOYEN || Math.abs(fN - fC) > SEUIL_FREQUENCE_TETE;
    if (echec) ok = false;
    details.push(
      `${s} : écart moyen ${ecartMoyen.toFixed(2)} point(s) ; groupe de tête ${fN.toFixed(1)} % (base normale) contre ${fC.toFixed(1)} % (base commune)${echec ? " — ÉCHEC" : ""}.`,
    );
  }
  details.push(
    "Rappel : avec des réponses aléatoires, les partis aux positions plus nuancées obtiennent en moyenne des scores plus élevés ; la fréquence en tête n'est pas un critère de neutralité en soi.",
  );
  if (commune.questions.length < 10) {
    details.push(`Base commune de ${commune.questions.length} questions seulement : la comparaison est plus bruitée.`);
  }
  return critere("A5b", "Effet des positions non documentées", ok, !d.lance, details, mesures, d.lance ? "alerte" : "echec");
}

function mots(texte: string): string[] {
  return texte.toLowerCase().split(/[^a-zàâäçéèêëîïôöùûüÿœæ'-]+/i).filter(Boolean);
}

// --- A6 : rédaction des énoncés ---
function a6(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = true;
  const noms = d.partis.flatMap((p) => {
    const chef = p.chef.nom.trim();
    const nomFamille = chef.split(/\s+/).slice(-1)[0];
    // Les sigles comptent toujours (PQ, QS) ; les autres noms, dès 3 lettres.
    return [p.sigle, ...[p.nom, chef, nomFamille].filter((x) => x && x.length > 2)];
  });
  for (const q of d.questions) {
    const m = mots(q.enonce);
    const evaluatifs = MOTS_EVALUATIFS.filter((w) => m.includes(w));
    if (evaluatifs.length > 0) {
      ok = false;
      details.push(`${q.id} : mot(s) évaluatif(s) « ${evaluatifs.join(", ")} ».`);
    }
    for (const n of noms) {
      if (new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(q.enonce)) {
        ok = false;
        details.push(`${q.id} : mention de « ${n} ».`);
      }
    }
    if (MOTIF_NUMERO_LOI.test(q.enonce)) {
      ok = false;
      details.push(`${q.id} : numéro de loi dans l'énoncé.`);
    }
    const aRelire = MOTS_A_RELIRE.filter((w) => ` ${q.enonce.toLowerCase()} `.includes(w));
    if (aRelire.length > 0) details.push(`À relire : ${q.id} contient ${aRelire.map((w) => `« ${w.trim()} »`).join(", ")}.`);
  }
  return critere("A6", "Rédaction des énoncés", ok, true, details);
}

// --- A7 : gabarits du texte de fin ---
function a7(d: Donnees): ResultatCritere {
  const details: string[] = [];
  let ok = true;
  if (d.questions.length === 0) return critere("A7", "Gabarits du texte de fin", false, true, ["Aucune question : texte non vérifiable."]);
  const alea = generateur(GRAINE + 1);
  const sigles = d.partis.map((p) => p.sigle);
  const profils: Reponses[] = [
    ...VALEURS.map((v) => profilUniforme(d, v)),
    ...Array.from({ length: 300 }, () => profilAleatoire(d, alea)),
  ];
  let sansDesaccords = 0;
  const trouvees = new Set<string>();
  profils.forEach((profil, i) => {
    const ex = genererExplication(d, profil, { ordre: sigles, chef: sigles[i % sigles.length] });
    const texte = texteIntegral(ex).toLowerCase();
    for (const f of FORMULATIONS_INTERDITES) if (texte.includes(f)) trouvees.add(f);
    if (ex.suffisant && !ex.sections.some((s) => s.id === "desaccords" && s.blocs.length > 0)) sansDesaccords += 1;
  });
  if (trouvees.size > 0) {
    ok = false;
    details.push(`Formulation(s) interdite(s) : ${[...trouvees].map((f) => `« ${f} »`).join(", ")}.`);
  }
  if (sansDesaccords > 0) {
    ok = false;
    details.push(`${sansDesaccords} texte(s) sans section de désaccords.`);
  }
  details.push(`${profils.length} textes générés et vérifiés.`);
  return critere("A7", "Gabarits du texte de fin", ok, true, details);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_HEURE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// --- A8 : intégrité de la traçabilité ---
function a8(d: Donnees): ResultatCritere {
  const details: string[] = [];
  const ids = new Set<string>();
  if (!DATE_HEURE.test(d.date_mise_a_jour)) details.push(`date_mise_a_jour « ${d.date_mise_a_jour} » : format AAAA-MM-JJTHH:MM attendu.`);
  for (const q of d.questions) {
    if (ids.has(q.id)) details.push(`${q.id} : identifiant en double.`);
    ids.add(q.id);
    if (q.sens !== 1 && q.sens !== -1) details.push(`${q.id} : sens invalide.`);
    if (!AXES.includes(q.axe)) details.push(`${q.id} : axe invalide.`);
    if (!q.enonce.trim()) details.push(`${q.id} : énoncé vide.`);
    for (const p of d.partis) {
      const pos = q.positions[p.sigle];
      const ref = `${q.id}/${p.sigle}`;
      if (!pos) {
        details.push(`${ref} : position absente (inscrire null avec le statut non_documentee).`);
        continue;
      }
      if (pos.statut === "documentee") {
        if (!VALEURS.includes(pos.valeur)) details.push(`${ref} : valeur hors de −2..+2.`);
        if (!pos.source?.trim()) details.push(`${ref} : source manquante.`);
        if (!DATE.test(pos.date ?? "")) details.push(`${ref} : date de la source manquante ou mal formée.`);
        if (!DATE.test(pos.consulte_le ?? "")) details.push(`${ref} : date de consultation manquante ou mal formée.`);
        if (!pos.extrait?.trim()) details.push(`${ref} : extrait manquant.`);
        if (pos.nature_extrait !== "citation" && pos.nature_extrait !== "paraphrase") details.push(`${ref} : nature de l'extrait invalide.`);
        if (!Array.isArray(pos.drapeaux)) details.push(`${ref} : drapeaux manquants.`);
        if (d.date_declenchement && pos.date < d.date_declenchement && !pos.drapeaux?.includes("anterieure_campagne")) {
          details.push(`${ref} : source antérieure au déclenchement sans le drapeau anterieure_campagne.`);
        }
        if (pos.type_source === "citation_presse" && !pos.drapeaux?.includes("source_secondaire")) {
          details.push(`${ref} : citation de presse sans le drapeau source_secondaire.`);
        }
      } else if (pos.statut === "non_documentee") {
        if (pos.valeur !== null) details.push(`${ref} : position non documentée avec une valeur.`);
        if (!["aucune_source", "sources_contradictoires", "a_l_etude"].includes(pos.motif)) details.push(`${ref} : motif invalide.`);
      } else {
        details.push(`${ref} : statut invalide.`);
      }
      for (const h of pos.historique ?? []) {
        if (!DATE_HEURE.test(h.remplacee_le ?? "") || !h.motif?.trim()) details.push(`${ref} : entrée d'historique incomplète.`);
      }
    }
  }
  for (const p of d.partis) {
    if (!p.chef.nom.trim() || !p.chef.source.trim()) details.push(`${p.sigle} : nom du chef ou source manquant.`);
  }
  return critere("A8", "Intégrité de la traçabilité", details.length === 0, true, details);
}

export function auditer(d: Donnees, options: { simulations?: number } = {}): RapportAudit {
  const criteres: ResultatCritere[] = [
    a1(d),
    a2(d),
    a3(d),
    ...a4(d),
    a5a(d),
    a5b(d, options.simulations ?? SIMULATIONS),
    a6(d),
    a7(d),
    a8(d),
  ];
  return {
    version: d.version,
    date_mise_a_jour: d.date_mise_a_jour,
    lance: d.lance,
    execute_le: new Date().toISOString(),
    criteres,
    reussi: !criteres.some((c) => c.bloquant),
  };
}
