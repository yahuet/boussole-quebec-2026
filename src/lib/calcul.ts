// Calcul de la proximité, des groupes d'équivalence et des coordonnées d'axe.
// Chaque fonction applique une section précise de METHODOLOGIE.md.

import type { AxeId, Donnees, Position, PositionDocumentee, Question, Reponses, Valeur } from "./types";

export const MIN_REPONSES = 10; // §6.5
export const BASE_REDUITE = 20; // §6.5 : de 10 à 19 réponses, avertissement
export const MIN_N_PARTI = 10; // §6.5
export const ECART_MAX_EQUIVALENCE = 4; // §6.3 : « moins de 5 points »

/** §6.1 : score d'accord entre une réponse et une position, de 0 à 1. */
export function scoreAccord(reponse: number, position: number): number {
  return 1 - Math.abs(reponse - position) / 4;
}

/** §6.1 : arrondi à l'entier, ,5 vers le haut. */
export function arrondir(x: number): number {
  return Math.floor(x + 0.5);
}

export function estDocumentee(p: Position | undefined): p is PositionDocumentee {
  return p !== undefined && p.statut === "documentee";
}

/** Valeur de la réponse, ou null si « sans opinion » ou sans réponse (§4, §8). */
export function valeurReponse(reponses: Reponses, id: string): Valeur | null {
  const r = reponses[id];
  if (!r || r.choix === "sans_opinion") return null;
  return r.choix;
}

export function poids(reponses: Reponses, id: string): 1 | 2 {
  return reponses[id]?.important && valeurReponse(reponses, id) !== null ? 2 : 1;
}

export function nombreReponses(donnees: Donnees, reponses: Reponses): number {
  return donnees.questions.filter((q) => valeurReponse(reponses, q.id) !== null).length;
}

export interface ResultatParti {
  sigle: string;
  /** Proximité non arrondie, de 0 à 100 ; null si aucune question comparable. */
  score: number | null;
  /** Proximité affichée (entier) ; null si non affichée (§6.5). */
  arrondi: number | null;
  /** Nombre de questions réellement prises en compte (n_k). */
  n: number;
  affiche: boolean;
  /** Questions répondues mais retirées pour ce parti (position non documentée). */
  exclusNonDocumentees: string[];
}

export interface OptionsCalcul {
  /** false : toutes les pondérations à 1 (pour afficher l'effet de l'importance, §6.4). */
  ponderation?: boolean;
  /** Positions à utiliser à la place des positions actuelles (recalcul historique, §13.7). */
  positions?: (q: Question, sigle: string) => Position | undefined;
}

/** §6.1 : proximité de chaque parti, sur sa base propre Q_k. */
export function calculerProximites(
  donnees: Donnees,
  reponses: Reponses,
  options: OptionsCalcul = {},
): ResultatParti[] {
  const ponderation = options.ponderation ?? true;
  const lirePosition = options.positions ?? ((q, s) => q.positions[s]);

  return donnees.partis.map((parti) => {
    let somme = 0;
    let sommePoids = 0;
    let n = 0;
    const exclus: string[] = [];
    for (const q of donnees.questions) {
      const a = valeurReponse(reponses, q.id);
      if (a === null) continue;
      const p = lirePosition(q, parti.sigle);
      if (!estDocumentee(p)) {
        exclus.push(q.id);
        continue;
      }
      const w = ponderation ? poids(reponses, q.id) : 1;
      somme += w * scoreAccord(a, p.valeur);
      sommePoids += w;
      n += 1;
    }
    const score = sommePoids > 0 ? (100 * somme) / sommePoids : null;
    const affiche = score !== null && n >= MIN_N_PARTI;
    return {
      sigle: parti.sigle,
      score,
      arrondi: affiche && score !== null ? arrondir(score) : null,
      n,
      affiche,
      exclusNonDocumentees: exclus,
    };
  });
}

/**
 * §6.3 : groupes d'équivalence, sur les scores arrondis, sans enchaînement.
 * Chaque groupe est trié par score décroissant ; l'interface le réordonne selon l'ordre de session.
 */
export function formerGroupes(resultats: ResultatParti[]): string[][] {
  const restants = resultats
    .filter((r) => r.affiche && r.arrondi !== null)
    .sort((a, b) => (b.arrondi as number) - (a.arrondi as number));
  const groupes: string[][] = [];
  while (restants.length > 0) {
    const tete = restants[0].arrondi as number;
    const groupe = restants.filter((r) => tete - (r.arrondi as number) <= ECART_MAX_EQUIVALENCE);
    groupes.push(groupe.map((r) => r.sigle));
    for (const r of groupe) restants.splice(restants.indexOf(r), 1);
  }
  return groupes;
}

/** §7 : coordonnée d'un axe à partir de valeurs (réponses ou positions), entre −1 et +1. */
function coordonnee(questions: Question[], valeur: (q: Question) => number | null): number | null {
  const valeurs: number[] = [];
  for (const q of questions) {
    const v = valeur(q);
    if (v !== null) valeurs.push(q.sens * v);
  }
  if (questions.length === 0 || valeurs.length < Math.ceil(questions.length / 2)) return null;
  return valeurs.reduce((s, v) => s + v, 0) / (2 * valeurs.length);
}

export type Coordonnees = Record<AxeId, number | null>;

const AXES: AxeId[] = ["economique", "constitutionnel", "identitaire"];

/** §7 : coordonnées de la personne et des partis, sans pondération d'importance. */
export function calculerCoordonnees(
  donnees: Donnees,
  reponses: Reponses,
): { vous: Coordonnees; partis: Record<string, Coordonnees> } {
  const parAxe = (axe: AxeId) => donnees.questions.filter((q) => q.axe === axe);
  const vous = {} as Coordonnees;
  const partis: Record<string, Coordonnees> = {};
  for (const axe of AXES) {
    vous[axe] = coordonnee(parAxe(axe), (q) => valeurReponse(reponses, q.id));
  }
  for (const parti of donnees.partis) {
    const c = {} as Coordonnees;
    for (const axe of AXES) {
      c[axe] = coordonnee(parAxe(axe), (q) => {
        const p = q.positions[parti.sigle];
        return estDocumentee(p) ? p.valeur : null;
      });
    }
    partis[parti.sigle] = c;
  }
  return { vous, partis };
}

// --- Contributions utilisées par le texte explicatif (§10.2) ---

export interface Contribution {
  question: Question;
  reponse: Valeur;
  poids: 1 | 2;
  position: PositionDocumentee;
  accord: number;
  /** Indicateur de tri propre à chaque section. */
  indice: number;
}

/** Scores d'accord des autres partis documentés sur une question. */
function accordsAutres(q: Question, sauf: string, a: number): number[] {
  return Object.entries(q.positions)
    .filter(([s, p]) => s !== sauf && estDocumentee(p))
    .map(([, p]) => scoreAccord(a, (p as PositionDocumentee).valeur));
}

/** §10.2.2 : questions qui vous rapprochent d'un parti plus que des autres. */
export function questionsRapprochement(donnees: Donnees, reponses: Reponses, sigle: string): Contribution[] {
  const items: Contribution[] = [];
  for (const q of donnees.questions) {
    const a = valeurReponse(reponses, q.id);
    const p = q.positions[sigle];
    if (a === null || !estDocumentee(p)) continue;
    const accord = scoreAccord(a, p.valeur);
    const autres = accordsAutres(q, sigle, a);
    if (autres.length === 0) continue;
    const moyenne = autres.reduce((s, v) => s + v, 0) / autres.length;
    const w = poids(reponses, q.id);
    const c = w * (accord - moyenne);
    if (accord >= 0.75 && c > 0) items.push({ question: q, reponse: a, poids: w, position: p, accord, indice: c });
  }
  return items.sort((x, y) => y.indice - x.indice);
}

/** §10.2.3 : écarts avec un parti. `ecartMin` = 2 pour les désaccords, 1 pour les nuances. */
export function questionsEcart(
  donnees: Donnees,
  reponses: Reponses,
  sigle: string,
  ecartMin: 1 | 2,
): Contribution[] {
  const items: Contribution[] = [];
  for (const q of donnees.questions) {
    const a = valeurReponse(reponses, q.id);
    const p = q.positions[sigle];
    if (a === null || !estDocumentee(p)) continue;
    const ecart = Math.abs(a - p.valeur);
    const garde = ecartMin === 2 ? ecart >= 2 : ecart === 1;
    if (!garde) continue;
    const w = poids(reponses, q.id);
    items.push({ question: q, reponse: a, poids: w, position: p, accord: scoreAccord(a, p.valeur), indice: w * ecart });
  }
  return items.sort((x, y) => y.indice - x.indice);
}

export interface Separation {
  question: Question;
  reponse: Valeur;
  poids: 1 | 2;
  positionA: PositionDocumentee;
  positionB: PositionDocumentee;
  /** s_A − s_B */
  difference: number;
}

/** §10.2.4 : questions où votre réponse est nettement plus proche de A que de B, ou l'inverse. */
export function questionsSeparation(
  donnees: Donnees,
  reponses: Reponses,
  a: string,
  b: string,
): { versA: Separation[]; versB: Separation[] } {
  const versA: Separation[] = [];
  const versB: Separation[] = [];
  for (const q of donnees.questions) {
    const r = valeurReponse(reponses, q.id);
    const pa = q.positions[a];
    const pb = q.positions[b];
    if (r === null || !estDocumentee(pa) || !estDocumentee(pb)) continue;
    const d = scoreAccord(r, pa.valeur) - scoreAccord(r, pb.valeur);
    if (Math.abs(d) < 0.5) continue;
    const item = { question: q, reponse: r, poids: poids(reponses, q.id), positionA: pa, positionB: pb, difference: d };
    (d > 0 ? versA : versB).push(item);
  }
  const tri = (x: Separation, y: Separation) => y.poids * Math.abs(y.difference) - x.poids * Math.abs(x.difference);
  return { versA: versA.sort(tri), versB: versB.sort(tri) };
}

// --- Sensibilité aux questions sans opinion (§8) ---

export interface Sensibilite {
  questions: string[];
  /** Écart (A − B) minimal et maximal, en points, non arrondis. */
  min: number;
  max: number;
}

const VALEURS: Valeur[] = [-2, -1, 0, 1, 2];

/**
 * §8 : intervalle de l'écart A − B selon les réponses qui auraient pu être données
 * aux questions laissées sans opinion (poids 1).
 *
 * Calcul exact : le poids d'une question ne dépend pas de la réponse choisie, donc les
 * dénominateurs de A et de B sont fixes une fois ces questions ajoutées. L'écart est alors
 * une somme de termes indépendants, un par question : on prend, pour chaque question,
 * la réponse qui minimise (ou maximise) son terme. Cela revient à essayer toutes les
 * combinaisons de réponses possibles.
 */
export function calculerSensibilite(
  donnees: Donnees,
  reponses: Reponses,
  a: string,
  b: string,
): Sensibilite | null {
  const pertinentes = donnees.questions.filter(
    (q) =>
      valeurReponse(reponses, q.id) === null &&
      (estDocumentee(q.positions[a]) || estDocumentee(q.positions[b])),
  );
  if (pertinentes.length === 0) return null;

  const base = (sigle: string) => {
    let somme = 0;
    let sommePoids = 0;
    for (const q of donnees.questions) {
      const r = valeurReponse(reponses, q.id);
      const p = q.positions[sigle];
      if (r === null || !estDocumentee(p)) continue;
      const w = poids(reponses, q.id);
      somme += w * scoreAccord(r, p.valeur);
      sommePoids += w;
    }
    for (const q of pertinentes) if (estDocumentee(q.positions[sigle])) sommePoids += 1;
    return { somme, sommePoids };
  };
  const ba = base(a);
  const bb = base(b);
  if (ba.sommePoids === 0 || bb.sommePoids === 0) return null;

  let min = (100 * ba.somme) / ba.sommePoids - (100 * bb.somme) / bb.sommePoids;
  let max = min;
  for (const q of pertinentes) {
    const pa = q.positions[a];
    const pb = q.positions[b];
    const termes = VALEURS.map(
      (v) =>
        (estDocumentee(pa) ? (100 * scoreAccord(v, pa.valeur)) / ba.sommePoids : 0) -
        (estDocumentee(pb) ? (100 * scoreAccord(v, pb.valeur)) / bb.sommePoids : 0),
    );
    min += Math.min(...termes);
    max += Math.max(...termes);
  }
  return { questions: pertinentes.map((q) => q.id), min, max };
}

// --- Historique des positions (§13.5, §13.7) ---

/** Position d'un parti telle qu'elle était publiée à une date donnée (AAAA-MM-JJ). */
export function positionALaDate(q: Question, sigle: string, date: string): Position | undefined {
  const actuelle = q.positions[sigle];
  if (!actuelle) return undefined;
  const historique = [...(actuelle.historique ?? [])].sort((x, y) => y.remplacee_le.localeCompare(x.remplacee_le));
  let resultat: Position = actuelle;
  for (const h of historique) {
    if (h.remplacee_le <= date) break;
    resultat =
      h.statut === "documentee" && h.valeur !== null
        ? {
            valeur: h.valeur,
            statut: "documentee",
            type_source: "declaration",
            source: h.source ?? "",
            date: h.date ?? "",
            consulte_le: "",
            extrait: h.extrait ?? "",
            nature_extrait: "citation",
            drapeaux: [],
          }
        : { valeur: null, statut: "non_documentee", motif: "aucune_source" };
  }
  return resultat;
}

export interface Changement {
  question: Question;
  sigle: string;
  avant: Valeur | null;
  apres: Valeur | null;
  position: Position;
}

/** §13.7 : positions modifiées depuis une date, sur les questions auxquelles vous avez répondu. */
export function changementsDepuis(donnees: Donnees, reponses: Reponses, date: string): Changement[] {
  const changements: Changement[] = [];
  for (const q of donnees.questions) {
    if (valeurReponse(reponses, q.id) === null) continue;
    for (const parti of donnees.partis) {
      const actuelle = q.positions[parti.sigle];
      if (!actuelle) continue;
      const avant = positionALaDate(q, parti.sigle, date);
      const vAvant = avant?.valeur ?? null;
      if (vAvant !== actuelle.valeur || avant?.statut !== actuelle.statut) {
        changements.push({ question: q, sigle: parti.sigle, avant: vAvant, apres: actuelle.valeur, position: actuelle });
      }
    }
  }
  return changements;
}
