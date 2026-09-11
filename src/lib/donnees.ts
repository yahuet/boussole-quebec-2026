import reelles from "../../data/positions.json";
import { donneesDemo } from "./demo";
import type { Donnees } from "./types";

/**
 * Données publiées. En développement seulement, NEXT_PUBLIC_DEMO=1 charge un jeu fictif
 * pour tester l'interface ; un déploiement Vercel avec ce réglage échoue volontairement.
 */
function charger(): Donnees {
  if (process.env.NEXT_PUBLIC_DEMO === "1") {
    if (process.env.VERCEL === "1") throw new Error("Le jeu de démonstration ne peut pas être déployé.");
    return donneesDemo();
  }
  return reelles as Donnees;
}

export const donnees: Donnees = charger();
export const estDemo = process.env.NEXT_PUBLIC_DEMO === "1";
export const donneesPretes = donnees.questions.length > 0;
