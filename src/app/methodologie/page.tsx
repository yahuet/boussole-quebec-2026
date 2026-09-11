import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { marked } from "marked";
import type { RapportAudit } from "@/lib/audit";
import { formaterDate } from "@/lib/libelles";

export const metadata: Metadata = { title: "Méthodologie — Boussole électorale Québec 2026" };

const STATUTS: Record<string, string> = { ok: "Respecté", echec: "En échec", alerte: "Alerte", info: "Information" };

function lireAudit(): RapportAudit | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "audit-resultats.json"), "utf8")) as RapportAudit;
  } catch {
    return null;
  }
}

export default function Methodologie() {
  // Source unique : le fichier METHODOLOGIE.md du dépôt, rendu tel quel à la construction du site.
  const html = marked.parse(readFileSync(join(process.cwd(), "METHODOLOGIE.md"), "utf8"), { async: false }) as string;
  const audit = lireAudit();
  const alertes = audit?.criteres.filter((c) => c.statut === "alerte") ?? [];

  return (
    <div className="space-y-8">
      {alertes.length > 0 && (
        <section className="rounded-lg border border-amber-300 bg-alerte-fond p-4 space-y-2" role="alert">
          <h2 className="font-semibold text-alerte">Alerte publique de l&apos;audit de neutralité</h2>
          <p className="text-sm">
            Depuis la dernière mise à jour des positions, au moins un critère qui dépend des données n&apos;est plus
            respecté. Les positions sont publiées quand même, parce qu&apos;elles reflètent ce que les partis ont dit
            (section 12). Voici les chiffres :
          </p>
          {alertes.map((c) => (
            <div key={c.id} className="text-sm">
              <p className="font-medium">
                {c.id} — {c.titre}
              </p>
              <ul className="list-disc pl-6">
                {c.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <article className="texte-long" dangerouslySetInnerHTML={{ __html: html }} />

      {audit && (
        <section className="space-y-3 max-w-3xl">
          <h2 className="text-xl font-semibold">Résultat du dernier audit de neutralité</h2>
          <p className="text-sm text-encre-douce">
            Données version {audit.version}, à jour au {formaterDate(audit.date_mise_a_jour)}. Le script est public :{" "}
            <code>scripts/audit-neutralite.ts</code>.
          </p>
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead>
                <tr className="text-left border-b border-trait">
                  <th className="py-2 pr-3">Critère</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2">Détails</th>
                </tr>
              </thead>
              <tbody>
                {audit.criteres.map((c) => (
                  <tr key={c.id} className="border-b border-trait align-top">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {c.id} — {c.titre}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">{STATUTS[c.statut]}</td>
                    <td className="py-2">
                      <ul className="space-y-1">
                        {c.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
