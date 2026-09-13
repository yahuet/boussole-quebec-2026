import Link from "next/link";
import QuestionDissequee from "@/components/QuestionDissequee";
import { donnees, donneesPretes } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";

const VOX_POP = "https://fichiers.voxpoplabs.com/boussole/methodologie.pdf";

function Constat({
  numero,
  titre,
  probleme,
  reponse,
  comparaison,
  liens,
}: {
  numero: number;
  titre: string;
  probleme: React.ReactNode;
  reponse: React.ReactNode;
  comparaison: React.ReactNode;
  liens: React.ReactNode;
}) {
  return (
    <section className="space-y-3 max-w-[66ch]" aria-labelledby={`constat-${numero}`}>
      <h3 id={`constat-${numero}`} className="text-h3">
        {numero}. {titre}
      </h3>
      <p>
        <strong>Le problème.</strong> {probleme}
      </p>
      <div>
        <strong>Ce que je fais.</strong> {reponse}
      </div>
      <p className="text-petit text-encre-douce border-l-2 border-trait pl-3">
        <strong className="text-encre">Pour comparer.</strong> {comparaison}
      </p>
      <p className="text-petit">{liens}</p>
    </section>
  );
}

export default function Accueil() {
  const nb = donnees.questions.length;
  return (
    <div className="space-y-16">
      <section className="grid gap-8 lg:grid-cols-12 lg:items-start" aria-labelledby="titre-accueil">
        <div className="space-y-5 lg:col-span-5">
          <h1 id="titre-accueil" className="text-h1">
            Comparez vos idées aux plateformes des partis, en voyant d&apos;où vient chaque position.
          </h1>
          <p className="max-w-[66ch]">
            Une question à la fois. Pour chaque parti, la position vient d&apos;un texte publié, et le lien est fourni.
            À la fin, une explication réponse par réponse.
          </p>
          {donneesPretes ? (
            <Link prefetch={false}
              href="/boussole"
              className="inline-flex items-center min-h-12 px-6 bg-ancre text-white font-bold no-underline rounded-[3px] hover:bg-ancre-fonce"
            >
              Commencer la boussole
            </Link>
          ) : (
            <p className="border border-trait-fort bg-surface px-4 py-3">
              Le questionnaire ouvrira dès que chaque position des partis aura été sourcée et validée.
            </p>
          )}
          <p className="text-petit text-encre-douce">
            {nb > 0 ? `${nb} questions` : "De 25 à 30 questions"} · environ 10 minutes · vos réponses ne quittent pas
            votre appareil
          </p>
        </div>
        <div className="lg:col-span-7">
          <QuestionDissequee />
        </div>
      </section>

      <section className="space-y-10" aria-labelledby="titre-differences">
        <div className="space-y-3 max-w-[66ch]">
          <h2 id="titre-differences" className="text-h2">
            Ce que je fais différemment
          </h2>
          <p>
            J&apos;ai utilisé des boussoles électorales et trois choses m&apos;ont manqué. Voici ce que je fais à la
            place. Les documents d&apos;un outil existant sont cités là où la comparaison aide à comprendre.
          </p>
        </div>

        <Constat
          numero={1}
          titre="Le graphique de positionnement"
          probleme="Sur un graphique, un parti apparaît à un endroit précis. Pour savoir pourquoi il est là plutôt que deux points plus loin, il faut pouvoir refaire le calcul avec les mêmes chiffres."
          reponse={
            <p className="inline">
              Chaque coordonnée est la moyenne des positions d&apos;un parti sur les questions d&apos;un axe, prise
              directement dans la matrice publiée. La formule est affichée à côté du graphique, et le calcul peut se
              refaire à la main. Un autre analyste, qui donnerait plus de poids à certaines questions ou les
              regrouperait autrement, placerait les points ailleurs. Le graphique est une manière de résumer, pas une
              mesure exacte.
            </p>
          }
          comparaison={
            <>
              La Boussole électorale de Radio-Canada, conçue par Vox Pop Labs, décrit une autre méthode dans son
              document méthodologique : les axes sont dégagés par analyse factorielle, et les positions sont estimées
              par un modèle statistique dont les poids viennent d&apos;un sondage pilote (
              <a href={VOX_POP}>document de Vox Pop Labs</a>, sections 4 et 6). Je n&apos;ai pas trouvé, dans les
              documents publiés, les valeurs de ces poids pour l&apos;édition québécoise 2026.
            </>
          }
          liens={<Link prefetch={false} href="/methodologie">La formule des coordonnées (méthodologie, section 7)</Link>}
        />

        <Constat
          numero={2}
          titre="La formulation des questions"
          probleme="La façon de poser une question peut orienter la réponse. Si « d'accord » mène toujours du même côté, ou si l'énoncé contient déjà un jugement, le résultat dépend en partie de la rédaction."
          reponse={
            <>
              <span>Les règles de rédaction sont publiées et vérifiables :</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>une seule mesure par question ;</li>
                <li>aucun adjectif qui juge ;</li>
                <li>aucun parti ni chef nommé ;</li>
                <li>un sens de « d&apos;accord » qui alterne ;</li>
                <li>une échelle symétrique à cinq points ;</li>
                <li>une option « sans opinion » qui retire la question du calcul sans pénaliser personne.</li>
              </ul>
              <p className="mt-2">
                La répartition des questions par thème et par axe est publiée, et les thèmes qui comptent moins de
                questions sont signalés, avec la raison. Un audit automatisé vérifie ces règles à chaque mise à jour,
                et son rapport est public.
              </p>
            </>
          }
          comparaison={
            <>
              Vox Pop Labs décrit sa sélection des questions : études pilotes auprès d&apos;environ 1 000 électeurs,
              jusqu&apos;à une centaine de propositions testées, retenues selon leur capacité à distinguer les partis
              et la clarté de leur formulation (<a href={VOX_POP}>document de Vox Pop Labs</a>, section 2.1). Je
              n&apos;y ai pas trouvé de règles de rédaction détaillées ni de rapport de vérification des énoncés.
            </>
          }
          liens={
            <>
              <Link prefetch={false} href="/methodologie">Les règles de rédaction</Link> ·{" "}
              <Link prefetch={false} href="/methodologie">Le rapport de l&apos;audit</Link>
            </>
          }
        />

        <Constat
          numero={3}
          titre="Les résultats et leur explication"
          probleme="Un pourcentage de proximité dit à quel point vos réponses ressemblent à celles d'un parti. Il ne dit pas lesquelles ont fait pencher le résultat."
          reponse={
            <>
              <span>À la fin, un texte construit à partir de vos réponses dit :</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>quelles réponses vous rapprochent de chaque parti ;</li>
                <li>lesquelles vous en éloignent ;</li>
                <li>
                  sur quoi vous êtes en désaccord avec le ou les partis les plus proches. Cette section n&apos;est
                  jamais omise, même quand la proximité est élevée.
                </li>
              </ul>
              <p className="mt-2">
                Le texte dit aussi ce qui a été retiré du calcul (vos « sans opinion », les positions non documentées)
                et l&apos;effet des questions que vous avez marquées comme importantes. Deux partis à moins de 5 points
                d&apos;écart sont présentés comme équivalents, et non comme premier et deuxième.
              </p>
            </>
          }
          comparaison={
            <>
              Selon son document méthodologique, la Boussole de Radio-Canada donne accès, dans ses résultats, aux
              positions attribuées aux partis et aux déclarations qui les justifient, avec leurs liens (
              <a href={VOX_POP}>document de Vox Pop Labs</a>, section 2.3.1). Ce que j&apos;ajoute : un texte qui
              classe vos réponses selon leur effet sur le résultat. Je n&apos;ai pas consulté l&apos;interface de
              leurs résultats, qui exige de remplir le questionnaire.
            </>
          }
          liens={<Link prefetch={false} href="/methodologie">Comment le texte est construit (méthodologie, section 10)</Link>}
        />
      </section>

      <section className="space-y-4 max-w-[66ch]" aria-labelledby="titre-choix">
        <h2 id="titre-choix" className="text-h2">
          Deux choix de méthode à connaître
        </h2>
        <p>Ces deux choix vont dans une autre direction que ceux que décrit Vox Pop Labs, et je les assume.</p>
        <ul className="space-y-4">
          <li>
            <strong>Je ne consulte pas les partis.</strong> Chaque position vient d&apos;un texte publié par le parti,
            que tout le monde peut lire. Vox Pop Labs, lui, invite les partis à se positionner et arbitre les
            désaccords (<a href={VOX_POP}>section 2.3.2</a>). Mon choix rend chaque position vérifiable par n&apos;importe
            qui. Il a un coût : une position qu&apos;un parti n&apos;a pas écrite reste non documentée.
          </li>
          <li>
            <strong>Une position non documentée est retirée du calcul, pas comptée comme neutre.</strong> Vox Pop Labs
            code « Neutre » un parti qui « ne prend pas position de manière cohérente, reporte sa décision ou évoque la
            question de manière indirecte » (<a href={VOX_POP}>section 2.3.1</a>). Ici, le calcul pour ce parti se fait
            sur les autres questions, et le résultat indique combien de questions ont compté.
          </li>
        </ul>
      </section>

      <section className="space-y-4 max-w-[66ch]" aria-labelledby="titre-limites">
        <h2 id="titre-limites" className="text-h2">
          Ce que l&apos;outil ne fait pas, et ce qui reste subjectif
        </h2>
        <p>
          <strong>Il ne recommande aucun vote.</strong> Il mesure l&apos;écart entre vos réponses et des positions
          écrites, sur un nombre limité de mesures. Le bilan des partis, leurs équipes, la crédibilité de leurs
          engagements et vos candidates et candidats locaux n&apos;y entrent pas.
        </p>
        <p>
          <strong>Il ne recueille aucune donnée.</strong> Pas de compte, pas de cookie de suivi, pas d&apos;outil de
          statistiques. Vos réponses restent dans votre navigateur ; elles ne sont conservées après la fermeture de
          l&apos;onglet que si vous le demandez.
        </p>
        <p>
          <strong>Il reste subjectif, et voici où :</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Le choix des questions.</strong> D&apos;autres questions donneraient d&apos;autres résultats. Les
            critères de choix sont publiés, mais le choix final est un jugement.
          </li>
          <li>
            <strong>Le codage des positions.</strong> Traduire un extrait de plateforme en « appuie en partie » ou
            « s&apos;oppose » demande une lecture. Les cas où deux lectures se défendent sont signalés dans la matrice.
          </li>
          <li>
            <strong>Qui fait le travail.</strong> Le codage initial est préparé avec un assistant d&apos;intelligence
            artificielle, puis vérifié et validé par une seule personne, l&apos;éditeur du site. Il n&apos;y a pas de
            comité de relecture.
          </li>
          <li>
            <strong>Les thèmes inégaux.</strong> Quand les partis n&apos;ont pas tous pris position sur les mêmes
            mesures, un thème compte moins de questions, et il pèse donc moins dans le résultat.
          </li>
          <li>
            <strong>Le calendrier.</strong> Les plateformes se publient en cours de campagne. Les positions sont mises à
            jour, et chaque modification est datée.
          </li>
        </ul>
        <p className="text-petit">
          <Link prefetch={false} href="/methodologie">Méthodologie complète</Link> ·{" "}
          <Link prefetch={false} href="/positions">Toutes les positions et leurs sources</Link> · Données à jour au{" "}
          {formaterDate(donnees.date_mise_a_jour)}
        </p>
      </section>
    </div>
  );
}
