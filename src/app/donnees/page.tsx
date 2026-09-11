import type { Metadata } from "next";
import Matrice from "@/components/Matrice";
import { donnees } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";

export const metadata: Metadata = { title: "D'où viennent les données — Boussole électorale Québec 2026" };

export default function Donnees() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">D&apos;où viennent les données</h1>
      <div className="max-w-3xl space-y-3">
        <p>
          Voici la matrice complète : pour chaque question, la position attribuée à chaque parti, la source, sa date et
          l&apos;extrait qui justifie la valeur. Une position sans source solide est déclarée non documentée ; elle est
          alors retirée du calcul pour ce parti seulement.
        </p>
        <p className="text-sm text-encre-douce">
          Données version {donnees.version}, à jour au {formaterDate(donnees.date_mise_a_jour)}. Campagne déclenchée le{" "}
          {donnees.date_declenchement ? formaterDate(donnees.date_declenchement) : "—"}. Fichier brut :{" "}
          <a className="underline" href="/positions.json">
            positions.json
          </a>
          . Une erreur ? Signalez-la avec l&apos;URL d&apos;une source admissible (méthodologie, section 14).
        </p>
      </div>
      <Matrice />
    </div>
  );
}
