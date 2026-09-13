"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { donnees, donneesPretes } from "@/lib/donnees";
import { LIBELLES_REPONSE } from "@/lib/libelles";
import { ecrireEtat, lireEtat, ordreSession } from "@/lib/session";
import type { Choix, Reponses, Valeur } from "@/lib/types";

const ECHELLE: Valeur[] = [2, 1, 0, -1, -2];

/** Rendu dans le navigateur seulement (voir ClientSeulement.tsx). */
export default function Questionnaire() {
  const router = useRouter();
  const questions = donnees.questions;
  const total = questions.length;
  const [etatInitial] = useState(() => lireEtat());
  const [ordre] = useState(() => ordreSession(donnees.partis.map((p) => p.sigle)));
  const [reponses, setReponses] = useState<Reponses>(() => etatInitial?.reponses ?? {});
  const [chef, setChef] = useState<string | null | undefined>(() => etatInitial?.chef);
  const [index, setIndex] = useState(() => {
    const premiere = questions.findIndex((q) => !etatInitial?.reponses[q.id]);
    return premiere === -1 ? total : premiere;
  });

  useEffect(() => {
    ecrireEtat({ ...lireEtat(), reponses, chef });
  }, [reponses, chef]);

  if (!donneesPretes) {
    return <p>Le questionnaire n&apos;est pas encore ouvert : les positions des partis sont en cours de validation.</p>;
  }

  const chefsDisponibles = donnees.partis.every((p) => p.chef.nom.trim() !== "");

  if (index >= total) {
    if (!chefsDisponibles) {
      return <FinSansChef onRetour={() => setIndex(total - 1)} />;
    }
    return (
      <QuestionChef
        ordre={ordre}
        choix={chef}
        onChoix={setChef}
        onRetour={() => setIndex(total - 1)}
        onTerminer={() => router.push("/boussole/resultats")}
      />
    );
  }

  const q = questions[index];
  const theme = donnees.themes.find((t) => t.id === q.theme);
  const r = reponses[q.id];
  const choisir = (choix: Choix) =>
    setReponses((prev) => ({
      ...prev,
      [q.id]: { choix, important: choix === "sans_opinion" ? false : (prev[q.id]?.important ?? false) },
    }));
  const basculerImportance = () =>
    setReponses((prev) => ({ ...prev, [q.id]: { ...prev[q.id], important: !prev[q.id]?.important } }));

  return (
    <div className="space-y-6 max-w-2xl">
      <Progression index={index} total={total} />
      <p className="text-petit uppercase tracking-wide text-encre-douce">{theme?.libelle}</p>
      <h1 className="text-h2">{q.enonce}</h1>
      {q.contexte && (
        <details className="rounded-[3px] border border-trait bg-surface px-4 py-3 text-petit">
          <summary className="cursor-pointer font-medium">Contexte</summary>
          <p className="mt-2 text-encre-douce">{q.contexte}</p>
          {q.contexte_source && (
            <a className="mt-1 inline-block underline text-encre-douce" href={q.contexte_source}>
              Source
            </a>
          )}
        </details>
      )}

      {index === 0 && (
        <p className="rounded-[3px] bg-vous-pale px-4 py-3 text-petit">
          « Neutre » veut dire que votre position est au milieu : elle compte dans le calcul. « Sans opinion » veut dire
          que vous ne vous prononcez pas : la question est retirée du calcul, sans pénalité.
        </p>
      )}

      <fieldset className="space-y-2">
        <legend className="sr-only">Votre réponse</legend>
        {ECHELLE.map((v) => (
          <BoutonChoix key={v} actif={r?.choix === v} onClick={() => choisir(v)}>
            {LIBELLES_REPONSE[v]}
          </BoutonChoix>
        ))}
        <div className="pt-2">
          <BoutonChoix actif={r?.choix === "sans_opinion"} onClick={() => choisir("sans_opinion")} discret>
            Sans opinion
          </BoutonChoix>
        </div>
      </fieldset>

      <label
        className={`flex items-center gap-3 text-petit ${!r || r.choix === "sans_opinion" ? "opacity-40" : "cursor-pointer"}`}
      >
        <input
          type="checkbox"
          className="h-5 w-5 accent-vous"
          disabled={!r || r.choix === "sans_opinion"}
          checked={!!r?.important}
          onChange={basculerImportance}
        />
        Cette question compte beaucoup pour moi (son poids est doublé)
      </label>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          className="rounded-[3px] border border-trait px-4 py-2 disabled:opacity-40"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Précédente
        </button>
        <button
          type="button"
          className="rounded-[3px] bg-ancre text-white hover:bg-ancre-fonce no-underline px-5 py-2 font-semibold disabled:opacity-40"
          disabled={!r}
          onClick={() => setIndex(index + 1)}
        >
          {index === total - 1 ? "Terminer" : "Suivante"}
        </button>
      </div>
    </div>
  );
}

function Progression({ index, total }: { index: number; total: number }) {
  return (
    <div>
      <div className="flex justify-between text-petit text-encre-douce mb-1">
        <span>
          Question {index + 1} sur {total}
        </span>
      </div>
      <div
        className="h-2 rounded-full bg-trait overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
      >
        <div className="h-full bg-vous transition-all" style={{ width: `${(100 * index) / total}%` }} />
      </div>
    </div>
  );
}

function BoutonChoix({
  actif,
  onClick,
  discret,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  discret?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={`w-full text-left rounded-[3px] border px-4 py-3 transition ${
        actif
          ? "border-vous bg-vous-pale font-semibold"
          : `border-trait bg-surface hover:border-encre-douce ${discret ? "text-encre-douce" : ""}`
      }`}
    >
      {children}
    </button>
  );
}

function QuestionChef({
  ordre,
  choix,
  onChoix,
  onRetour,
  onTerminer,
}: {
  ordre: string[];
  choix: string | null | undefined;
  onChoix: (s: string | null) => void;
  onRetour: () => void;
  onTerminer: () => void;
}) {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-petit text-encre-douce">Dernière question — elle n&apos;entre pas dans le calcul.</p>
      <h1 className="text-h2">Lequel de ces chefs ferait selon vous le meilleur premier ministre&nbsp;?</h1>
      <fieldset className="space-y-2">
        <legend className="sr-only">Votre choix</legend>
        {ordre.map((sigle) => {
          const parti = donnees.partis.find((p) => p.sigle === sigle);
          if (!parti) return null;
          return (
            <BoutonChoix key={sigle} actif={choix === sigle} onClick={() => onChoix(sigle)}>
              {parti.chef.nom} <span className="font-normal text-encre-douce">— {parti.nom}</span>
            </BoutonChoix>
          );
        })}
        <div className="pt-2">
          <BoutonChoix actif={choix === null} onClick={() => onChoix(null)} discret>
            Aucun / je ne sais pas
          </BoutonChoix>
        </div>
      </fieldset>
      <div className="flex justify-between">
        <button type="button" className="rounded-[3px] border border-trait px-4 py-2" onClick={onRetour}>
          Précédente
        </button>
        <button
          type="button"
          className="rounded-[3px] bg-ancre text-white hover:bg-ancre-fonce no-underline px-5 py-2 font-semibold disabled:opacity-40"
          disabled={choix === undefined}
          onClick={onTerminer}
        >
          Voir mes résultats
        </button>
      </div>
    </div>
  );
}

function FinSansChef({ onRetour }: { onRetour: () => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-h2">Questionnaire terminé</h1>
      <div className="flex gap-3">
        <button type="button" className="rounded-[3px] border border-trait px-4 py-2" onClick={onRetour}>
          Précédente
        </button>
        <Link prefetch={false} href="/boussole/resultats" className="rounded-[3px] bg-ancre text-white hover:bg-ancre-fonce no-underline px-5 py-2 font-semibold">
          Voir mes résultats
        </Link>
      </div>
    </div>
  );
}
