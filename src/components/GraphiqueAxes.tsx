"use client";

import { useState } from "react";
import type { Coordonnees } from "@/lib/calcul";
import { donnees } from "@/lib/donnees";
import type { AxeId } from "@/lib/types";

const TAILLE = 360;
const MARGE = 40;

/** §7 : axe économique en abscisse ; axe constitutionnel ou identitaire en ordonnée. */
export default function GraphiqueAxes({
  coordonnees,
  ordre,
}: {
  coordonnees: { vous: Coordonnees; partis: Record<string, Coordonnees> };
  ordre: string[];
}) {
  const [axeY, setAxeY] = useState<AxeId>("constitutionnel");
  const axeX = donnees.axes.find((a) => a.id === "economique");
  const y = donnees.axes.find((a) => a.id === axeY);
  if (!axeX || !y) return null;

  const px = (v: number) => MARGE + ((v + 1) / 2) * (TAILLE - 2 * MARGE);
  const py = (v: number) => TAILLE - MARGE - ((v + 1) / 2) * (TAILLE - 2 * MARGE);

  const points = ordre
    .map((s) => ({ sigle: s, x: coordonnees.partis[s]?.economique ?? null, y: coordonnees.partis[s]?.[axeY] ?? null }))
    .filter((p): p is { sigle: string; x: number; y: number } => p.x !== null && p.y !== null);
  const absents = ordre.filter((s) => !points.some((p) => p.sigle === s));
  const vx = coordonnees.vous.economique;
  const vy = coordonnees.vous[axeY];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Où se situent vos réponses</h2>
      <div className="flex gap-2 text-sm" role="group" aria-label="Axe vertical">
        {(["constitutionnel", "identitaire"] as AxeId[]).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={axeY === a}
            onClick={() => setAxeY(a)}
            className={`rounded-full border px-3 py-1 ${axeY === a ? "border-encre bg-encre text-white" : "border-trait bg-surface"}`}
          >
            {donnees.axes.find((x) => x.id === a)?.libelle}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-trait bg-surface p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${TAILLE} ${TAILLE}`}
          className="w-full max-w-md mx-auto block"
          role="img"
          aria-label={`Graphique : ${axeX.libelle} en abscisse, ${y.libelle} en ordonnée`}
        >
          <rect x={MARGE} y={MARGE} width={TAILLE - 2 * MARGE} height={TAILLE - 2 * MARGE} fill="none" stroke="var(--color-trait)" />
          <line x1={px(0)} y1={MARGE} x2={px(0)} y2={TAILLE - MARGE} stroke="var(--color-trait)" />
          <line x1={MARGE} y1={py(0)} x2={TAILLE - MARGE} y2={py(0)} stroke="var(--color-trait)" />
          <text x={MARGE} y={TAILLE - 12} fontSize="10" fill="var(--color-encre-douce)">
            ← {axeX.pole_negatif}
          </text>
          <text x={TAILLE - MARGE} y={TAILLE - 12} fontSize="10" textAnchor="end" fill="var(--color-encre-douce)">
            {axeX.pole_positif} →
          </text>
          <text x={MARGE} y={MARGE - 10} fontSize="10" fill="var(--color-encre-douce)">
            ↑ {y.pole_positif}
          </text>
          <text x={MARGE} y={TAILLE - MARGE + 16} fontSize="10" fill="var(--color-encre-douce)">
            ↓ {y.pole_negatif}
          </text>
          {points.map((p) => (
            <g key={p.sigle}>
              <circle cx={px(p.x)} cy={py(p.y)} r={6} fill="var(--color-parti)" />
              <text x={px(p.x) + 9} y={py(p.y) + 4} fontSize="11" fill="var(--color-encre)">
                {p.sigle}
              </text>
            </g>
          ))}
          {vx !== null && vy !== null && (
            <g>
              <rect
                x={px(vx) - 7}
                y={py(vy) - 7}
                width={14}
                height={14}
                transform={`rotate(45 ${px(vx)} ${py(vy)})`}
                fill="var(--color-vous)"
              />
              <text x={px(vx) + 10} y={py(vy) - 8} fontSize="11" fontWeight="600" fill="var(--color-vous)">
                Vous
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-sm text-encre-douce">
        Chaque point est la moyenne des réponses ou des positions sur les questions de l&apos;axe. Un point au centre
        peut vouloir dire des positions modérées, ou des positions nettes mais dans des directions différentes selon les
        questions : le graphique résume, il ne remplace pas le détail question par question.
      </p>
      {(vx === null || vy === null) && (
        <p className="text-sm text-encre-douce">
          Votre point n&apos;apparaît pas : vous avez répondu à moins de la moitié des questions de l&apos;un des axes.
        </p>
      )}
      {absents.length > 0 && (
        <p className="text-sm text-encre-douce">
          Non placé(s) faute de positions documentées sur la moitié des questions de l&apos;axe : {absents.join(", ")}.
        </p>
      )}
    </section>
  );
}
