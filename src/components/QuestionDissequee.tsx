/**
 * Ouverture de l'accueil : une question d'exemple, avec des partis FICTIFS, annotée en quatre repères
 * (plan de design, section 4, idée 1). Aucun parti réel, aucune position réelle.
 */
function Repere({ n, titre, children }: { n: number; titre: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-x-3 py-4 border-t border-trait first:border-t-0">
      <span
        aria-hidden="true"
        className="h-8 w-8 flex items-center justify-center border-2 border-ancre text-ancre font-bold rounded-full"
      >
        {n}
      </span>
      <div className="space-y-1">
        <p className="font-bold text-ancre">{titre}</p>
        <div>{children}</div>
      </div>
    </li>
  );
}

export default function QuestionDissequee() {
  return (
    <figure className="border border-trait-fort bg-surface" aria-labelledby="exemple-legende">
      <figcaption id="exemple-legende" className="px-4 py-2 border-b border-trait text-petit text-encre-douce">
        Exemple, avec des partis fictifs
      </figcaption>
      <div className="px-4 pt-4">
        <p className="text-h4 font-bold text-encre">
          « Le Québec devrait rendre obligatoire l&apos;affichage du prix au kilo dans les épiceries. »
        </p>
      </div>
      <ol className="px-4">
        <Repere n={1} titre="Une seule mesure, sans mot qui juge">
          L&apos;énoncé décrit ce qui changerait, pas ce qu&apos;il faudrait en penser.
        </Repere>
        <Repere n={2} titre="Le sens de « d'accord » change d'une question à l'autre">
          Ici, « d&apos;accord » rapproche du pôle « rôle accru de l&apos;État ». À la question suivante, ce pourrait
          être l&apos;inverse.
        </Repere>
        <Repere n={3} titre="Chaque position a sa source">
          <ul className="space-y-1">
            <li>
              Parti A : appuie la mesure <span className="renvoi">plateforme, 2 septembre</span>
            </li>
            <li>
              Parti B : s&apos;oppose à la mesure <span className="renvoi">communiqué, 28 août</span>
            </li>
            <li>
              Parti C : position non documentée. La question est retirée de son calcul, et vous en êtes informé.
            </li>
          </ul>
        </Repere>
        <Repere n={4} titre="Le calcul est public">
          <p className="font-bold whitespace-nowrap">Accord = 1 − |r − p| ÷ 4</p>
          <p className="text-petit text-encre-douce">
            r : votre réponse, de −2 à +2 · p : la position du parti, sur la même échelle. L&apos;accord va de 0 à 1.
          </p>
        </Repere>
      </ol>
    </figure>
  );
}
