"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculerCoordonnees, calculerProximites, changementsDepuis, positionALaDate } from "@/lib/calcul";
import { donnees } from "@/lib/donnees";
import { genererExplication } from "@/lib/explication";
import {
  conserverReponses,
  ecrireEtat,
  effacerReponsesConservees,
  effacerTout,
  lireEtat,
  lireEtatConserve,
  ordreSession,
  reponsesConservees,
  type EtatReponses,
} from "@/lib/session";
import BarresProximite from "./BarresProximite";
import DetailQuestions from "./DetailQuestions";
import GraphiqueAxes from "./GraphiqueAxes";
import SectionTexte from "./SectionTexte";

/** État au chargement : si les données ont changé depuis la dernière visite, on retient l'ancienne date (§13.7). */
function etatInitial(): EtatReponses | null {
  const courant = lireEtat();
  if (!courant) return null;
  const garde = lireEtatConserve();
  let datePrecedente = courant.datePrecedente;
  if (!datePrecedente && garde?.dateDonnees && garde.dateDonnees !== donnees.date_mise_a_jour) {
    datePrecedente = garde.dateDonnees;
  }
  return { ...courant, dateDonnees: donnees.date_mise_a_jour, datePrecedente };
}

/** Rendu dans le navigateur seulement (voir ClientSeulement.tsx). */
export default function Resultats() {
  const [etat, setEtat] = useState<EtatReponses | null>(etatInitial);
  const [ordre] = useState(() => ordreSession(donnees.partis.map((p) => p.sigle)));
  const [conserve, setConserve] = useState(reponsesConservees);

  useEffect(() => {
    if (etat) ecrireEtat(etat);
  }, [etat]);

  const explication = useMemo(() => {
    if (!etat || ordre.length === 0) return null;
    const depuis = etat.datePrecedente;
    const changements = depuis
      ? {
          depuis,
          liste: changementsDepuis(donnees, etat.reponses, depuis),
          scoresAvant: calculerProximites(donnees, etat.reponses, {
            positions: (q, s) => positionALaDate(q, s, depuis),
          }),
        }
      : undefined;
    return genererExplication(donnees, etat.reponses, { ordre, chef: etat.chef, changements });
  }, [etat, ordre]);

  const coordonnees = useMemo(() => (etat ? calculerCoordonnees(donnees, etat.reponses) : null), [etat]);

  if (!etat || !explication || !coordonnees) {
    return (
      <div className="space-y-4">
        <h1 className="text-h2">Aucune réponse trouvée</h1>
        <p>Vos réponses ne sont gardées que dans cet onglet, sauf si vous avez choisi de les conserver sur cet appareil.</p>
        <Link prefetch={false} href="/boussole" className="inline-block rounded-[3px] bg-ancre text-white hover:bg-ancre-fonce no-underline px-5 py-2 font-semibold">
          Commencer le questionnaire
        </Link>
      </div>
    );
  }

  const basculerConservation = () => {
    if (conserve) {
      effacerReponsesConservees();
      setConserve(false);
    } else {
      conserverReponses(etat);
      setConserve(true);
    }
  };

  const [tete, ...autres] = explication.sections;

  return (
    <div className="space-y-10">
      <h1 className="text-h1">Vos résultats</h1>

      <SectionTexte section={tete} />

      {explication.suffisant && (
        <>
          <BarresProximite resultats={explication.resultats} groupes={explication.groupes} ordre={ordre} />
          <GraphiqueAxes coordonnees={coordonnees} ordre={ordre} />
        </>
      )}

      {autres.map((s) => (
        <SectionTexte key={s.id} section={s} />
      ))}

      <DetailQuestions reponses={etat.reponses} ordre={ordre} />

      <section className="rounded-[3px] border border-trait bg-surface p-4 space-y-3">
        <h2 className="text-h4">Vos réponses</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-vous" checked={conserve} onChange={basculerConservation} />
          <span>
            Conserver mes réponses sur cet appareil, pour voir mes résultats recalculés si les positions des partis
            changent pendant la campagne.
            <span className="block text-petit text-encre-douce">
              Elles restent dans ce navigateur seulement ; rien n&apos;est envoyé. À éviter sur un appareil partagé.
            </span>
          </span>
        </label>
        <div className="flex flex-wrap gap-3 text-petit">
          <Link prefetch={false} href="/boussole" className="rounded-[3px] border border-trait px-4 py-2">
            Modifier mes réponses
          </Link>
          <button
            type="button"
            className="rounded-[3px] border border-trait px-4 py-2"
            onClick={() => {
              effacerTout();
              setEtat(null);
              setConserve(false);
            }}
          >
            Effacer mes réponses de cet appareil
          </button>
        </div>
      </section>
    </div>
  );
}
