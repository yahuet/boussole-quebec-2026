"use client";

// État dans le navigateur seulement (METHODOLOGIE.md, sections 11 et 13.7).
// - sessionStorage : réponses en cours et ordre aléatoire des partis ; effacé à la fermeture de l'onglet.
// - localStorage : seulement si la personne coche « Conserver mes réponses sur cet appareil ».
// Aucun cookie, aucun envoi à un serveur.

import type { Reponses } from "./types";

const CLE_ORDRE = "boussole:ordre";
const CLE_SESSION = "boussole:reponses";
const CLE_CONSERVEES = "boussole:reponses-conservees";

export interface EtatReponses {
  reponses: Reponses;
  chef?: string | null;
  /** date_mise_a_jour des données utilisées lors du dernier calcul. */
  dateDonnees?: string;
  /** Date des données de la visite précédente, si elles ont changé depuis (§13.7). */
  datePrecedente?: string;
}

function lire<T>(stockage: Storage | undefined, cle: string): T | null {
  try {
    const brut = stockage?.getItem(cle);
    return brut ? (JSON.parse(brut) as T) : null;
  } catch {
    return null;
  }
}

function ecrire(stockage: Storage | undefined, cle: string, valeur: unknown) {
  try {
    stockage?.setItem(cle, JSON.stringify(valeur));
  } catch {
    // Stockage indisponible (navigation privée stricte) : l'outil fonctionne quand même, sans mémoire.
  }
}

const session = () => (typeof window === "undefined" ? undefined : window.sessionStorage);
const local = () => (typeof window === "undefined" ? undefined : window.localStorage);

/** §11 : ordre aléatoire des partis, tiré une fois par session d'onglet. */
export function ordreSession(sigles: string[]): string[] {
  const existant = lire<string[]>(session(), CLE_ORDRE);
  if (existant && existant.length === sigles.length && sigles.every((s) => existant.includes(s))) return existant;
  const ordre = [...sigles];
  const alea = new Uint32Array(ordre.length);
  crypto.getRandomValues(alea);
  for (let i = ordre.length - 1; i > 0; i--) {
    const j = alea[i] % (i + 1);
    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
  }
  ecrire(session(), CLE_ORDRE, ordre);
  return ordre;
}

export function lireEtat(): EtatReponses | null {
  return lire<EtatReponses>(session(), CLE_SESSION) ?? lire<EtatReponses>(local(), CLE_CONSERVEES);
}

export function ecrireEtat(etat: EtatReponses) {
  ecrire(session(), CLE_SESSION, etat);
  if (reponsesConservees()) ecrire(local(), CLE_CONSERVEES, etat);
}

export function reponsesConservees(): boolean {
  return lire<EtatReponses>(local(), CLE_CONSERVEES) !== null;
}

export function lireEtatConserve(): EtatReponses | null {
  return lire<EtatReponses>(local(), CLE_CONSERVEES);
}

export function conserverReponses(etat: EtatReponses) {
  ecrire(local(), CLE_CONSERVEES, etat);
}

export function effacerReponsesConservees() {
  try {
    local()?.removeItem(CLE_CONSERVEES);
  } catch {
    // rien à effacer
  }
}

export function effacerTout() {
  effacerReponsesConservees();
  try {
    session()?.removeItem(CLE_SESSION);
  } catch {
    // rien à effacer
  }
}
