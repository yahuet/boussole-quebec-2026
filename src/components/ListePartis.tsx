"use client";

import { ordreSession } from "@/lib/session";
import { useClient } from "@/lib/useClient";

/**
 * Réordonne les fiches des partis selon l'ordre tiré au hasard pour la visite (méthodologie §11).
 * Pendant la construction statique (et sans JavaScript), l'ordre est alphabétique de sigle.
 */
export default function ListePartis({ fiches }: { fiches: { sigle: string; contenu: React.ReactNode }[] }) {
  const client = useClient();
  const alpha = [...fiches].sort((a, b) => a.sigle.localeCompare(b.sigle));
  const ordre = client ? ordreSession(alpha.map((f) => f.sigle)) : alpha.map((f) => f.sigle);
  return (
    // Tant que l'ordre de la visite n'est pas connu, la liste reste invisible (sans perdre sa place) :
    // on évite qu'elle saute à l'écran quand l'ordre alphabétique est remplacé par l'ordre tiré au hasard.
    // Sans JavaScript, la balise noscript la rend visible dans l'ordre alphabétique.
    <>
    <noscript>
      <style>{`.liste-partis{visibility:visible!important}`}</style>
    </noscript>
    <ul
      className={`liste-partis grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 ${client ? "" : "invisible"}`}
    >
      {ordre.map((s) => (
        // Grille commune (subgrid) : nom, portrait, résumé et liens s'alignent d'une fiche à l'autre.
        <li
          key={s}
          aria-labelledby={`parti-${s}`}
          className="grid grid-rows-subgrid row-span-4 gap-3 border border-trait bg-surface p-4"
        >
          {fiches.find((f) => f.sigle === s)?.contenu}
        </li>
      ))}
    </ul>
    </>
  );
}
