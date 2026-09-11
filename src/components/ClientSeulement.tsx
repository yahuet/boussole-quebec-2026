"use client";

import dynamic from "next/dynamic";

// Ces composants lisent le stockage du navigateur dès leur initialisation :
// ils ne sont jamais rendus pendant la construction statique du site.
const chargement = () => <p className="text-encre-douce">Chargement…</p>;

export const QuestionnaireClient = dynamic(() => import("./Questionnaire"), { ssr: false, loading: chargement });
export const ResultatsClient = dynamic(() => import("./Resultats"), { ssr: false, loading: chargement });
