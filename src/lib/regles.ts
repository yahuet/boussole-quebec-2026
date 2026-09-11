// Listes de contrôle utilisées par l'audit (METHODOLOGIE.md, sections 3 et 10.3).

/** §10.3 : formulations interdites dans le texte de fin (comparaison en minuscules). */
export const FORMULATIONS_INTERDITES = [
  "vous devriez",
  "nous recommandons",
  "votre meilleur choix",
  "le bon choix",
  "fait pour vous",
  "votre parti",
  "vous êtes un électeur",
  "vous êtes une électrice",
  "vous appartenez",
  "voter pour",
  "idéal",
  "parfait",
  "pourtant",
  "malgré",
  "en réalité",
  "vous êtes de gauche",
  "vous êtes de droite",
  "progressiste",
  "vous êtes conservat",
];

/** §3, règle 3 : mots évaluatifs interdits dans les énoncés (mots entiers, minuscules). */
export const MOTS_EVALUATIFS = [
  "excessif", "excessive", "excessifs", "excessives",
  "insuffisant", "insuffisante", "insuffisants", "insuffisantes",
  "nécessaire", "nécessaires",
  "dangereux", "dangereuse", "dangereuses",
  "juste", "justes", "injuste", "injustes",
  "raisonnable", "raisonnables",
  "équitable", "équitables",
  "abusif", "abusive", "abusifs", "abusives",
  "légitime", "légitimes",
  "essentiel", "essentielle", "essentiels", "essentielles",
  "important", "importante", "importants", "importantes",
  "urgent", "urgente", "urgents", "urgentes",
  "responsable", "responsables",
  "trop", "assez", "enfin", "vraiment",
];

/** §3, règles 1 et 7 : à relire (pas bloquant). */
export const MOTS_A_RELIRE = [" et ", " ou ", " ainsi que ", " de même que ", "ne devrait pas", " ne ", " n'"];

/** §3, règle 5 : désignations de lois associées à un gouvernement. */
export const MOTIF_NUMERO_LOI = /\b(loi|projet de loi|PL)\s*n?o?\.?\s*\d+/i;
