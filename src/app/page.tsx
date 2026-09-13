import Link from "next/link";
import { donnees, donneesPretes } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";

export default function Accueil() {
  const noms = [...donnees.partis].sort((a, b) => a.sigle.localeCompare(b.sigle));
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight">
          De quelles plateformes vos idées se rapprochent-elles&nbsp;?
        </h1>
        <p className="text-lg text-encre-douce max-w-2xl">
          Répondez à {donnees.questions.length || "une trentaine de"} questions sur des mesures précises. L&apos;outil compare vos réponses aux positions écrites de cinq
          partis pour l&apos;élection générale québécoise du 5 octobre 2026, et vous explique le résultat, réponse par
          réponse — y compris vos désaccords avec le parti le plus proche.
        </p>
        <p className="text-sm text-encre-douce">
          Partis couverts, en ordre alphabétique : {noms.map((p) => `${p.nom} (${p.sigle})`).join(", ")}.
        </p>
        {donneesPretes ? (
          <Link
            href="/questionnaire"
            className="inline-block rounded-lg bg-encre text-white px-6 py-3 font-semibold hover:bg-black"
          >
            Commencer le questionnaire
          </Link>
        ) : (
          <p className="rounded-lg border border-trait bg-surface px-4 py-3">
            Les positions des partis sont en cours de recherche et de validation. Le questionnaire sera ouvert dès que
            chaque position aura été sourcée et validée.
          </p>
        )}
        <p className="text-sm text-encre-douce">Environ 8 à 10 minutes. Données à jour au {formaterDate(donnees.date_mise_a_jour)}.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Carte titre="Chaque position est sourcée">
          Chaque position attribuée à un parti renvoie à une source vérifiable — plateforme, engagement daté, vote à
          l&apos;Assemblée nationale — avec un extrait. Sans source, la position est déclarée non documentée, jamais
          devinée.{" "}
          <Link className="underline" href="/donnees">
            Voir toutes les sources
          </Link>
        </Carte>
        <Carte titre="La méthode est publique">
          La formule de calcul, le choix des questions et les contrôles de neutralité ont été publiés avant la collecte
          des données.{" "}
          <Link className="underline" href="/methodologie">
            Lire la méthodologie
          </Link>
        </Carte>
        <Carte titre="Rien ne sort de votre navigateur">
          Pas de compte, pas de cookie de suivi, pas d&apos;analytique. Vos réponses restent sur votre appareil, et ne
          sont conservées après la fermeture de l&apos;onglet que si vous le demandez.
        </Carte>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="text-xl font-semibold">Ce que l&apos;outil ne fait pas</h2>
        <ul className="list-disc pl-6 space-y-1 text-encre-douce">
          <li>Il ne vous dit pas pour qui voter. Ce n&apos;est pas une recommandation de vote.</li>
          <li>Il ne juge pas la crédibilité des engagements, le bilan des partis ni leurs équipes.</li>
          <li>Il ne couvre qu&apos;un nombre limité de mesures : d&apos;autres enjeux peuvent compter davantage pour vous.</li>
          <li>Il ne tient pas compte des candidates et candidats de votre circonscription.</li>
        </ul>
      </section>
    </div>
  );
}

function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-trait bg-surface p-4 space-y-2">
      <h2 className="font-semibold">{titre}</h2>
      <p className="text-sm text-encre-douce">{children}</p>
    </div>
  );
}
