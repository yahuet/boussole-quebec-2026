"use client";

import { useState } from "react";
import { donnees } from "@/lib/donnees";
import { useClient } from "@/lib/useClient";
import {
  LIBELLES_DRAPEAU,
  LIBELLES_MOTIF,
  LIBELLES_POSITION,
  LIBELLES_TYPE_SOURCE,
  formaterDate,
} from "@/lib/libelles";
import { ordreSession } from "@/lib/session";
import type { Position, Question } from "@/lib/types";

const alphabetique = () => [...donnees.partis.map((p) => p.sigle)].sort((a, b) => a.localeCompare(b));

export default function Matrice() {
  const [mode, setMode] = useState<"session" | "alpha">("session");
  // Pendant la construction statique, l'ordre alphabétique ; dans le navigateur, l'ordre de session.
  const client = useClient();
  const ordre = mode === "alpha" || !client ? alphabetique() : ordreSession(donnees.partis.map((p) => p.sigle));

  if (donnees.questions.length === 0) {
    return <p className="rounded-lg border border-trait bg-surface p-4">La matrice est en cours de constitution.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Ordre des partis">
        <span className="text-encre-douce">Ordre des partis :</span>
        {(
          [
            ["session", "aléatoire (session)"],
            ["alpha", "alphabétique"],
          ] as const
        ).map(([m, t]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3 py-1 ${mode === m ? "border-encre bg-encre text-white" : "border-trait bg-surface"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {donnees.themes.map((theme) => (
        <section key={theme.id} className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-trait pb-1">{theme.libelle}</h2>
          {theme.note_couverture && (
            <p className="rounded-lg border border-amber-300 bg-alerte-fond p-3 text-sm">
              <span className="font-semibold">Thème incomplet. </span>
              {theme.note_couverture}
            </p>
          )}
          {donnees.questions
            .filter((q) => q.theme === theme.id)
            .map((q) => (
              <CarteQuestion key={q.id} question={q} ordre={ordre} />
            ))}
        </section>
      ))}
    </div>
  );
}

function CarteQuestion({ question, ordre }: { question: Question; ordre: string[] }) {
  const axe = donnees.axes.find((a) => a.id === question.axe);
  const pole = question.sens === 1 ? axe?.pole_positif : axe?.pole_negatif;
  return (
    <article className="rounded-lg border border-trait bg-surface p-4 space-y-3" id={question.id}>
      <header className="space-y-1">
        <p className="text-xs text-encre-douce">
          {question.id} · {axe?.libelle} · « d&apos;accord » rapproche du pôle « {pole} »
        </p>
        <h3 className="font-semibold">{question.enonce}</h3>
        {question.contexte && (
          <p className="text-sm text-encre-douce">
            Contexte : {question.contexte}{" "}
            {question.contexte_source && (
              <a className="underline" href={question.contexte_source}>
                source
              </a>
            )}
          </p>
        )}
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {ordre.map((s) => (
          <CellulePosition key={s} sigle={s} position={question.positions[s]} />
        ))}
      </div>
    </article>
  );
}

function CellulePosition({ sigle, position }: { sigle: string; position: Position | undefined }) {
  const parti = donnees.partis.find((p) => p.sigle === sigle);
  return (
    <div className="rounded border border-trait p-3 text-sm space-y-1">
      <p className="font-medium">
        {parti?.nom} <span className="text-encre-douce">({sigle})</span>
      </p>
      {!position || position.statut === "non_documentee" ? (
        <p className="text-encre-douce">
          Non documentée{position ? ` — ${LIBELLES_MOTIF[position.motif]}` : ""}
          {position?.note && <span className="block">{position.note}</span>}
        </p>
      ) : (
        <>
          <p>
            <span className="font-semibold">{LIBELLES_POSITION[position.valeur]}</span>{" "}
            <span className="text-encre-douce">(valeur {position.valeur > 0 ? `+${position.valeur}` : position.valeur})</span>
          </p>
          <blockquote className="italic text-encre-douce">
            « {position.extrait} »{position.nature_extrait === "paraphrase" && " (paraphrase)"}
          </blockquote>
          <p>
            <a className="underline break-all" href={position.source} target="_blank" rel="noopener noreferrer">
              {LIBELLES_TYPE_SOURCE[position.type_source]}
            </a>{" "}
            <span className="text-encre-douce">
              · {formaterDate(position.date)} · consultée le {formaterDate(position.consulte_le)}
            </span>
            {position.archive && (
              <>
                {" "}
                ·{" "}
                <a className="underline" href={position.archive}>
                  copie archivée
                </a>
              </>
            )}
          </p>
          {position.drapeaux.length > 0 && (
            <p className="flex flex-wrap gap-1">
              {position.drapeaux.map((d) => (
                <span key={d} className="rounded bg-alerte-fond text-alerte px-1.5 py-0.5 text-xs">
                  {LIBELLES_DRAPEAU[d]}
                </span>
              ))}
            </p>
          )}
          {position.note && <p className="text-encre-douce">Note : {position.note}</p>}
        </>
      )}
      {position?.historique && position.historique.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer">Historique ({position.historique.length})</summary>
          <ul className="mt-1 space-y-1">
            {position.historique.map((h, i) => (
              <li key={i}>
                Jusqu&apos;au {formaterDate(h.remplacee_le)} :{" "}
                {h.valeur === null ? "non documentée" : LIBELLES_POSITION[h.valeur]} — {h.motif}
                {h.source && (
                  <>
                    {" "}
                    (
                    <a className="underline" href={h.source}>
                      ancienne source
                    </a>
                    )
                  </>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
