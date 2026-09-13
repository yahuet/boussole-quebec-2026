import type { Metadata } from "next";
import Link from "next/link";
import { COURRIEL, DEPOT, EDITEUR, IDENTIFICATION_EDITEUR, NOM_SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: `Qui publie ${NOM_SITE}, pourquoi, comment le travail est fait, et comment signaler une erreur.`,
};

export default function APropos() {
  return (
    <div className="space-y-10 max-w-[66ch]">
      <h1 className="text-h1">À propos</h1>

      <section className="space-y-3" aria-labelledby="qui">
        <h2 id="qui" className="text-h2">
          Qui publie ce site
        </h2>
        <p>
          Ce site est publié par <strong>{EDITEUR.nom}</strong>, de {EDITEUR.ville}.
        </p>
        <p>Je ne suis membre d&apos;aucun parti politique et je n&apos;ai aucune affiliation politique.</p>
        <p>
          J&apos;ai financé ce site personnellement, y compris le nom de domaine et l&apos;hébergement. Il n&apos;a ni
          commanditaire, ni publicité, ni contribution d&apos;un parti.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="pourquoi">
        <h2 id="pourquoi" className="text-h2">
          Pourquoi
        </h2>
        <p>
          En utilisant des boussoles électorales, j&apos;ai voulu pouvoir vérifier trois choses : d&apos;où vient la
          position attribuée à chaque parti, comment les questions sont rédigées, et quelles réponses produisent le
          résultat. Ce site est ma façon d&apos;y répondre : une méthode publiée avant la collecte des données, une
          matrice de positions où chaque case a sa source, et une explication réponse par réponse.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="comment">
        <h2 id="comment" className="text-h2">
          Comment le travail est fait
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Méthode publiée d&apos;abord.</strong> La méthodologie a été approuvée et publiée le 11 septembre
            2026, avant la recherche des positions. Chaque modification ultérieure est datée et justifiée dans le{" "}
            <a href={`${DEPOT}/blob/main/data/journal-modifications.md`}>journal des modifications</a>.
          </li>
          <li>
            <strong>Positions sourcées.</strong> Chaque position vient d&apos;un texte publié par le parti :
            plateforme, engagement, vote à l&apos;Assemblée nationale, déclaration. L&apos;adresse, la date et un extrait
            sont fournis. Sans source, la position est déclarée non documentée.
          </li>
          <li>
            <strong>Assistance d&apos;intelligence artificielle.</strong> La recherche des sources, le codage initial des
            positions et la veille quotidienne des annonces sont réalisés avec un assistant d&apos;intelligence
            artificielle (Claude, d&apos;Anthropic). Chaque position publiée est vérifiée et validée par moi.
            L&apos;assistant propose ; il ne publie rien.
          </li>
          <li>
            <strong>Code et données publics.</strong> Tout le projet est dans un <a href={DEPOT}>dépôt public</a>.
            N&apos;importe qui peut relire la matrice, refaire l&apos;audit et suivre l&apos;historique.
          </li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="donnees">
        <h2 id="donnees" className="text-h2">
          Vos données
        </h2>
        <p>
          Ce site ne recueille aucune donnée : pas de compte, pas de formulaire, pas de cookie de suivi, pas d&apos;outil
          de statistiques. Vos réponses restent dans votre navigateur.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="erreur">
        <h2 id="erreur" className="text-h2">
          Signaler une erreur
        </h2>
        <p>
          Une position vous semble mal attribuée, une source a changé, un extrait est inexact ? Indiquez :
        </p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>la question concernée ;</li>
          <li>le parti ;</li>
          <li>l&apos;adresse (URL) d&apos;une source publiée par le parti ;</li>
          <li>l&apos;extrait qui justifie la correction.</li>
        </ol>
        <p>Deux façons de le faire :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Dans le dépôt public</strong>, en ouvrant un <a href={`${DEPOT}/issues`}>signalement</a>. Il faut un
            compte GitHub, et le signalement est public.
          </li>
          <li>
            <strong>Par courriel</strong> : <a href={`mailto:${COURRIEL}`}>{COURRIEL}</a>
          </li>
        </ul>
        <p>
          Chaque correction acceptée est datée dans le journal des modifications, avec l&apos;ancienne et la nouvelle
          source.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="joindre">
        <h2 id="joindre" className="text-h2">
          Me joindre
        </h2>
        <p>
          <a href={`mailto:${COURRIEL}`}>{COURRIEL}</a>
        </p>
        {IDENTIFICATION_EDITEUR && <p>{IDENTIFICATION_EDITEUR}</p>}
        <p className="text-petit">
          <Link prefetch={false} href="/credits">Crédits des images et des polices</Link>
        </p>
      </section>
    </div>
  );
}
