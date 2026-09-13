"use client";

import { useState } from "react";
import type { Coordonnees } from "@/lib/calcul";
import { donnees } from "@/lib/donnees";
import type { AxeId } from "@/lib/types";

const TAILLE = 300;
const MARGE = 16;
const RAYON = 7;
const HAUTEUR_ETIQUETTE = 17;

interface Point {
  sigle: string;
  x: number;
  y: number;
  couleur: string;
}

/**
 * Place les étiquettes des sigles à droite des points en évitant qu'elles se chevauchent :
 * une étiquette trop proche d'une autre déjà placée est décalée vers le bas, puis vers le haut.
 */
function placerEtiquettes(points: { sigle: string; cx: number; cy: number }[]) {
  const placees: { sigle: string; x: number; y: number }[] = [];
  const tri = [...points].sort((a, b) => a.cy - b.cy || a.cx - b.cx);
  for (const p of tri) {
    const largeur = p.sigle.length * 10;
    let y = p.cy + 4;
    const chevauche = (yy: number) =>
      placees.some((e) => Math.abs(e.y - yy) < HAUTEUR_ETIQUETTE && Math.abs(e.x - (p.cx + 10)) < largeur + 4);
    for (let decalage = 1; chevauche(y) && decalage < 8; decalage++) {
      const bas = p.cy + 4 + decalage * HAUTEUR_ETIQUETTE;
      const haut = p.cy + 4 - decalage * HAUTEUR_ETIQUETTE;
      y = !chevauche(bas) ? bas : haut;
    }
    // Près du bord droit, l'étiquette passe à gauche du point pour rester dans le cadre.
    const x = p.cx + 10 + largeur > TAILLE ? p.cx - 10 - largeur : p.cx + 10;
    placees.push({ sigle: p.sigle, x, y });
  }
  return Object.fromEntries(placees.map((e) => [e.sigle, e]));
}

/**
 * §7 : axe économique en abscisse ; axe constitutionnel ou identitaire en ordonnée.
 * §11 : les couleurs des partis n'apparaissent qu'à l'intérieur des points, toujours avec le sigle écrit ;
 * tous les points ont la même forme et la même taille, et un contour ardoise assure le contraste.
 */
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

  const points: Point[] = ordre
    .map((s) => ({
      sigle: s,
      x: coordonnees.partis[s]?.economique ?? null,
      y: coordonnees.partis[s]?.[axeY] ?? null,
      couleur: donnees.partis.find((p) => p.sigle === s)?.couleur?.valeur ?? "var(--color-parti)",
    }))
    .filter((p): p is Point => p.x !== null && p.y !== null);
  const etiquettes = placerEtiquettes(points.map((p) => ({ sigle: p.sigle, cx: px(p.x), cy: py(p.y) })));
  const absents = ordre.filter((s) => !points.some((p) => p.sigle === s));
  const vx = coordonnees.vous.economique;
  const vy = coordonnees.vous[axeY];

  return (
    <section className="space-y-4" aria-labelledby="titre-graphique">
      <h2 id="titre-graphique" className="text-h2">
        Où se situent vos réponses
      </h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Axe vertical du graphique">
        {(["constitutionnel", "identitaire"] as AxeId[]).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={axeY === a}
            onClick={() => setAxeY(a)}
            className={`rounded-[3px] border px-4 min-h-12 ${
              axeY === a ? "border-ancre bg-ancre text-white" : "border-trait-fort bg-surface text-ancre"
            }`}
          >
            {donnees.axes.find((x) => x.id === a)?.libelle}
          </button>
        ))}
      </div>
      <div className="border border-trait bg-surface p-3 text-petit text-encre-douce">
        <p className="text-center">↑ {y.pole_positif}</p>
        <svg
          viewBox={`0 0 ${TAILLE} ${TAILLE}`}
          className="w-full max-w-md mx-auto block my-2"
          role="img"
          aria-labelledby="desc-graphique"
        >
          <desc id="desc-graphique">
            {`${axeX.libelle} en abscisse (de « ${axeX.pole_negatif} » à « ${axeX.pole_positif} »), ${y.libelle} en ordonnée (de « ${y.pole_negatif} » à « ${y.pole_positif} »). `}
            {points.map((p) => `${p.sigle} : ${p.x.toFixed(2)} ; ${p.y.toFixed(2)}.`).join(" ")}
            {vx !== null && vy !== null ? ` Vous : ${vx.toFixed(2)} ; ${vy.toFixed(2)}.` : ""}
          </desc>
          <rect x={MARGE} y={MARGE} width={TAILLE - 2 * MARGE} height={TAILLE - 2 * MARGE} fill="none" stroke="var(--color-trait)" />
          <line x1={px(0)} y1={MARGE} x2={px(0)} y2={TAILLE - MARGE} stroke="var(--color-trait)" />
          <line x1={MARGE} y1={py(0)} x2={TAILLE - MARGE} y2={py(0)} stroke="var(--color-trait)" />
          {points.map((p) => (
            <circle
              key={p.sigle}
              cx={px(p.x)}
              cy={py(p.y)}
              r={RAYON}
              fill={p.couleur}
              stroke="var(--color-encre)"
              strokeWidth={1.5}
            />
          ))}
          {points.map((p) => (
            <text
              key={`e-${p.sigle}`}
              x={etiquettes[p.sigle].x}
              y={etiquettes[p.sigle].y}
              fontSize="16"
              fontWeight="700"
              fill="var(--color-encre)"
              stroke="var(--color-surface)"
              strokeWidth={3}
              paintOrder="stroke"
            >
              {p.sigle}
            </text>
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
                stroke="var(--color-surface)"
                strokeWidth={1.5}
              />
              <text
                x={px(vx) + 12}
                y={py(vy) - 10}
                fontSize="16"
                fontWeight="700"
                fill="var(--color-vous)"
                stroke="var(--color-surface)"
                strokeWidth={3}
                paintOrder="stroke"
              >
                Vous
              </text>
            </g>
          )}
        </svg>
        <p className="text-center">↓ {y.pole_negatif}</p>
        <p className="flex justify-between gap-4 mt-2">
          <span>← {axeX.pole_negatif}</span>
          <span className="text-right">{axeX.pole_positif} →</span>
        </p>
      </div>
      <div className="max-w-[66ch] space-y-2 text-petit text-encre-douce">
        <p>
          <span className="font-bold text-encre">Comment les points sont calculés.</span> Coordonnée d&apos;un parti
          sur un axe = moyenne, sur les questions de cet axe où sa position est documentée, de (sens de la question ×
          position du parti), divisée par 2. Votre point se calcule de la même façon avec vos réponses. Chaque valeur
          vient de la <a href="/positions">matrice des positions</a>.
        </p>
        <p>
          Un autre analyste, qui pondérerait les questions autrement ou les regrouperait sur d&apos;autres axes,
          placerait les points ailleurs. Un point au centre peut aussi vouloir dire des positions nettes dans des
          directions différentes : le graphique résume, il ne remplace pas le détail question par question.
        </p>
        <p>Couleurs des points relevées sur les sites officiels des partis ; chaque point porte aussi son sigle.</p>
        {(vx === null || vy === null) && (
          <p>Votre point n&apos;apparaît pas : vous avez répondu à moins de la moitié des questions de l&apos;un des axes.</p>
        )}
        {absents.length > 0 && (
          <p>
            Non placé(s), faute de positions documentées sur la moitié des questions de l&apos;axe : {absents.join(", ")}.
          </p>
        )}
      </div>
    </section>
  );
}
