import { donnees } from "@/lib/donnees";

// Fichier brut de la matrice, servi tel quel (METHODOLOGIE.md, section 14).
export const dynamic = "force-static";

export function GET() {
  return Response.json(donnees);
}
