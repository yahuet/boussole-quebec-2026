import type { Choix, Drapeau, MotifNonDocumentee, TypeSource, Valeur } from "./types";

export const LIBELLES_REPONSE: Record<Valeur, string> = {
  [-2]: "Tout à fait en désaccord",
  [-1]: "Plutôt en désaccord",
  0: "Neutre",
  1: "Plutôt d'accord",
  2: "Tout à fait d'accord",
};

export function libelleChoix(choix: Choix | undefined): string {
  if (choix === undefined || choix === "sans_opinion") return "Sans opinion";
  return LIBELLES_REPONSE[choix];
}

/** Libellés des positions des partis (grille de la section 5.2). */
export const LIBELLES_POSITION: Record<Valeur, string> = {
  2: "Appuie la mesure",
  1: "Appuie en partie ou sous condition",
  0: "Position intermédiaire",
  [-1]: "S'oppose en partie ou sous condition",
  [-2]: "S'oppose à la mesure",
};

export const LIBELLES_MOTIF: Record<MotifNonDocumentee, string> = {
  aucune_source: "aucune source trouvée",
  sources_contradictoires: "sources contradictoires",
  a_l_etude: "le parti dit étudier la question",
};

export const LIBELLES_DRAPEAU: Record<Drapeau, string> = {
  anterieure_campagne: "Source antérieure à la campagne",
  anterieure_chef: "Source antérieure au chef actuel",
  source_secondaire: "Source secondaire (presse)",
};

export const LIBELLES_TYPE_SOURCE: Record<TypeSource, string> = {
  plateforme: "Plateforme 2026",
  engagement: "Engagement de campagne",
  programme: "Programme du parti",
  vote: "Vote à l'Assemblée nationale",
  declaration: "Déclaration officielle",
  citation_presse: "Citation rapportée par la presse",
};

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « 2026-09-11 » ou « 2026-09-11T14:30 » → « 11 septembre 2026 ». */
export function formaterDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const jour = Number(m[3]);
  return `${jour === 1 ? "1er" : jour} ${MOIS[Number(m[2]) - 1]} ${m[1]}`;
}

/** Pourcentage avec espace insécable, à la française : « 72 % ». */
export function pct(n: number): string {
  return `${n} %`;
}

export function pluriel(n: number, singulier: string, pluriel?: string): string {
  return `${n} ${n > 1 ? (pluriel ?? singulier + "s") : singulier}`;
}
