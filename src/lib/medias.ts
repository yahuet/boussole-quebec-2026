// Portraits des chefs (design/PLAN-DESIGN.md, section 5 ; A-VERIFIER.md, point 6).
// Règles :
// - seulement des photographies sous licence libre, créditées dans data/credits.json ;
// - mêmes dimensions et même cadrage (4:5) pour les cinq, en deux tailles (320 × 400 et 640 × 800), AVIF et WebP ;
// - si un seul des cinq portraits manque, AUCUN portrait n'est affiché : les cinq partis reçoivent le même traitement.
// Ce module lit le système de fichiers : il ne s'utilise que dans des composants serveur (au moment de la construction).

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface CreditImage {
  /** Préfixe des fichiers dans public/medias, par exemple « portraits/CAQ ». */
  fichier: string;
  sigle: string;
  sujet: string;
  auteur: string;
  source: string;
  licence: string;
  licence_url: string;
  modifications?: string;
  consulte_le: string;
}

export interface CreditPolice {
  nom: string;
  auteur: string;
  source: string;
  licence: string;
  licence_url: string;
  consulte_le: string;
}

export interface Credits {
  images: CreditImage[];
  polices: CreditPolice[];
}

export const TAILLES_PORTRAIT = [320, 640] as const;
export const FORMATS_PORTRAIT = ["avif", "webp"] as const;

export function lireCredits(): Credits {
  return JSON.parse(readFileSync(join(process.cwd(), "data", "credits.json"), "utf8")) as Credits;
}

function fichiersPresents(prefixe: string): boolean {
  return TAILLES_PORTRAIT.every((t) =>
    FORMATS_PORTRAIT.every((f) => existsSync(join(process.cwd(), "public", "medias", `${prefixe}-${t}.${f}`))),
  );
}

/**
 * Portraits utilisables, par sigle. Renvoie null si l'un des partis n'a pas de portrait complet
 * (crédit + quatre fichiers) : dans ce cas, aucun portrait n'est affiché.
 */
export function portraitsDisponibles(sigles: string[]): Record<string, CreditImage> | null {
  const credits = lireCredits().images;
  const trouves: Record<string, CreditImage> = {};
  for (const sigle of sigles) {
    const credit = credits.find((c) => c.sigle === sigle && c.fichier.startsWith("portraits/"));
    if (!credit || !credit.licence.trim() || !credit.auteur.trim() || !fichiersPresents(credit.fichier)) return null;
    trouves[sigle] = credit;
  }
  return trouves;
}
