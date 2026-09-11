import type { ResultatParti } from "@/lib/calcul";
import { donnees } from "@/lib/donnees";
import { pct } from "@/lib/libelles";

/**
 * Proximité de chaque parti, dans l'ordre aléatoire de la session (§11) — jamais triée par score.
 * Tous les partis ont la même couleur ; le groupe le plus proche est signalé par une mention, pas par une couleur.
 */
export default function BarresProximite({
  resultats,
  groupes,
  ordre,
}: {
  resultats: ResultatParti[];
  groupes: string[][];
  ordre: string[];
}) {
  const tete = new Set(groupes[0] ?? []);
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Proximité avec chaque plateforme</h2>
      <p className="text-sm text-encre-douce">
        Les partis sont présentés dans un ordre tiré au hasard pour votre session, et non selon leur score.
      </p>
      <ul className="space-y-3">
        {ordre.map((sigle) => {
          const r = resultats.find((x) => x.sigle === sigle);
          const parti = donnees.partis.find((p) => p.sigle === sigle);
          if (!r || !parti) return null;
          return (
            <li key={sigle} className="rounded-lg border border-trait bg-surface p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-medium">
                  {parti.nom} <span className="text-encre-douce">({sigle})</span>
                </span>
                {r.affiche ? (
                  <span className="text-sm">
                    <span className="text-lg font-semibold">{pct(r.arrondi as number)}</span>
                    <span className="text-encre-douce"> · sur {r.n} questions</span>
                  </span>
                ) : (
                  <span className="text-sm text-encre-douce">Trop peu de questions comparables ({r.n})</span>
                )}
              </div>
              {r.affiche && (
                <div className="mt-2 h-3 rounded-full bg-trait overflow-hidden" aria-hidden>
                  <div className="h-full bg-parti" style={{ width: `${r.arrondi}%` }} />
                </div>
              )}
              {tete.has(sigle) && (
                <p className="mt-2 text-sm font-medium">
                  {tete.size > 1 ? "Parmi les partis les plus proches, à égalité" : "Le plus proche de vos réponses"}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
