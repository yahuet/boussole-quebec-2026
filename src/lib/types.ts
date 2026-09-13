// Types des données publiées (data/positions.json) et des réponses.
// Voir METHODOLOGIE.md, sections 4 et 5.

export type Valeur = -2 | -1 | 0 | 1 | 2;
export type Sens = 1 | -1;

export type AxeId = "economique" | "constitutionnel" | "identitaire";

export type TypeSource =
  | "plateforme"
  | "engagement"
  | "programme"
  | "vote"
  | "declaration"
  | "citation_presse";

export type Drapeau = "anterieure_campagne" | "anterieure_chef" | "source_secondaire";

export type MotifNonDocumentee = "aucune_source" | "sources_contradictoires" | "a_l_etude";

export interface EntreeHistorique {
  valeur: Valeur | null;
  statut: "documentee" | "non_documentee";
  source?: string;
  date?: string;
  extrait?: string;
  /** Date et heure du remplacement, au même format que `date_mise_a_jour` (AAAA-MM-JJTHH:MM). */
  remplacee_le: string;
  motif: string;
}

export interface PositionDocumentee {
  valeur: Valeur;
  statut: "documentee";
  type_source: TypeSource;
  source: string;
  date: string;
  consulte_le: string;
  extrait: string;
  nature_extrait: "citation" | "paraphrase";
  archive?: string;
  drapeaux: Drapeau[];
  note?: string;
  historique?: EntreeHistorique[];
}

export interface PositionNonDocumentee {
  valeur: null;
  statut: "non_documentee";
  motif: MotifNonDocumentee;
  note?: string;
  historique?: EntreeHistorique[];
}

export type Position = PositionDocumentee | PositionNonDocumentee;

export interface Question {
  id: string;
  theme: string;
  axe: AxeId;
  sens: Sens;
  enonce: string;
  contexte?: string;
  contexte_source?: string;
  /** Code de la candidate dans les notes de recherche (traçabilité de la sélection). */
  code_recherche?: string;
  positions: Record<string, Position>;
}

export interface Chef {
  nom: string;
  depuis?: string;
  source: string;
  note?: string;
}

export interface Parti {
  sigle: string;
  nom: string;
  /** Forme avec article : « la CAQ », « le PQ », « QS ». */
  le: string;
  /** Forme avec « de » : « de la CAQ », « du PQ », « de QS ». */
  du: string;
  chef: Chef;
  resultat_2022?: { pourcentage: number; source: string };
}

export interface Axe {
  id: AxeId;
  libelle: string;
  pole_negatif: string;
  pole_positif: string;
}

export interface Theme {
  id: string;
  libelle: string;
  /** Axe des questions de ce thème (§2.1). */
  axe: AxeId;
}

/** §2.2 : seul thème dont une question peut être classée sur l'axe constitutionnel par exception. */
export const THEME_EXCEPTION_CONSTITUTIONNEL = "immigration_langue";

export interface Donnees {
  version: string;
  /** AAAA-MM-JJTHH:MM, heure de l'Est. */
  date_mise_a_jour: string;
  /** Date officielle du déclenchement de la campagne (AAAA-MM-JJ). */
  date_declenchement: string | null;
  source_declenchement?: string;
  /** true une fois le site lancé : les énoncés sont gelés (section 13.1). */
  lance: boolean;
  partis: Parti[];
  axes: Axe[];
  themes: Theme[];
  questions: Question[];
}

export type Choix = Valeur | "sans_opinion";

export interface ReponseQuestion {
  choix: Choix;
  important: boolean;
}

/** Réponses indexées par identifiant de question. Une question absente = sans opinion. */
export type Reponses = Record<string, ReponseQuestion>;
