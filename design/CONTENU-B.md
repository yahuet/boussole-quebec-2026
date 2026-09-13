# Étape B — Contenu rédactionnel : accueil et /a-propos

Soumis pour validation le 13 septembre 2026. Les passages entre [crochets] sont à compléter ou à confirmer par Yanick Huet ; aucun ne sera publié tel quel.

---

## Sources consultées sur la Boussole électorale de Radio-Canada

Consultées le 13 septembre 2026. Tout ce qui est dit de cet outil sur le site doit s'appuyer sur ces deux sources.

1. **Site de la Boussole électorale, édition Québec 2026**, sections « À propos » et « Aide » : https://boussole.radio-canada.ca/
2. **Vox Pop Labs, *Méthodologie de la Boussole électorale*, version 2026.1** (« Dernière mise à jour : Juin 2026 », fichier en ligne modifié le 31 août 2026), 22 pages : https://fichiers.voxpoplabs.com/boussole/methodologie.pdf

**Ce que ces documents décrivent, en résumé fidèle :**

| Sujet | Ce que Vox Pop Labs publie | Page |
|---|---|---|
| Responsable | Vox Pop Labs, « entreprise sociale indépendante et non partisane, fondée et dirigée par des universitaires » ; outil présenté par Radio-Canada | §1.2 ; site |
| Recommandation de vote | Les résultats « ne constituent ni des recommandations de vote, ni des prédictions » | §1.3 |
| Choix des questions | Études pilotes auprès d'« environ 1000 électeurs admissibles (ou plus) », jusqu'à « une centaine de propositions ». Critères : capacité à différencier partis et électeurs, clarté, faible taux de non-réponse, diversité des enjeux. | §2.1 |
| Sources des positions | Déclarations publiques hiérarchisées : plateformes, documents officiels, déclarations et communiqués, ministres et porte-parole, autres élus, constitution et résolutions du parti | §2.3 |
| Codage | Plusieurs codeurs indépendants, puis harmonisation. « Neutre » quand le parti « ne prend pas position de manière cohérente, reporte sa décision ou évoque la question de manière indirecte ». | §2.3.1 |
| Consultation des partis | Les partis s'autopositionnent. En cas de divergence, un rapport de réconciliation leur est transmis ; les litiges non résolus vont à un conseil consultatif d'universitaires. | §2.3.2 |
| Sources dans l'outil | Positions et « déclarations publiques justificatives (accompagnées de leurs URL) » dans les sections « Vous vs. Parti » et « Parti vs. Parti » des résultats | §2.3.1 |
| Graphique (paysage politique) | Dimensions obtenues par analyse factorielle ; positions estimées par un modèle bayésien de réponse ordonnée (probit), estimation MAP ; poids propres à chaque question, « déterminés à partir des données recueillies lors du sondage pilote » | §4, §6.1–6.3 |
| Proximité (graphique à barres) | Distance de Manhattan, divisée par la distance maximale possible compte tenu des réponses de l'utilisateur, ramenée sur 100 | §5.1, §6.4 |
| Importance | Poids de 0 à 10 par enjeu | §5.2, §6.5 |
| Données | Réponses utilisées pour la recherche, pondérées selon des données démographiques. « CBC/Radio-Canada ne reçoit ni ne conserve les réponses » (site). | §1.6 ; site, section « Aide » |

**Ce que je n'ai pas trouvé** dans ces documents : les valeurs des poids (charges factorielles, paramètres de discrimination) de l'édition 2026 ; des règles de rédaction détaillées des énoncés (polarité, vocabulaire) ; un rapport de vérification de la neutralité des énoncés ; la liste des questions écartées. **Je n'ai pas vu l'interface des résultats elle-même** : il faut remplir le questionnaire, ce qui transmet des réponses à Vox Pop Labs, et je ne l'ai pas fait sans ton accord.

**Conséquence pour tes trois constats.**
- **Constat 1.** Il tient, mais doit être précis. La méthode du graphique est **décrite** ; ce qui manque pour **refaire** le calcul, ce sont les valeurs des poids. On ne peut pas écrire qu'« on ne sait pas d'où viennent les coordonnées ».
- **Constat 3.** Selon leur document, les positions et leurs sources sont déjà accessibles question par question. La différence réelle est ailleurs : un texte généré qui **trie** les réponses selon leur effet sur le résultat et qui présente obligatoirement les désaccords.
- **Constat 2.** Il tient : leur sélection est décrite, mais pas de règles de rédaction ni de rapport de vérification.

Les textes ci-dessous tiennent compte de ces trois constats.

---

# PAGE D'ACCUEIL ( / )

## Hero — la question disséquée

**Titre (h1)**
Comparez vos idées aux plateformes des partis, en voyant d'où vient chaque position.

**Chapeau**
Une question à la fois. Pour chaque parti, la position vient d'un texte publié, et le lien est fourni. À la fin, une explication réponse par réponse.

**Schéma annoté** — encadré intitulé « Exemple, avec des partis fictifs »

> « Le Québec devrait rendre obligatoire l'affichage du prix au kilo dans les épiceries. »

1. **Une seule mesure, sans mot qui juge.** L'énoncé décrit ce qui changerait, pas ce qu'il faudrait en penser.
2. **Le sens de « d'accord » change d'une question à l'autre.** Ici, « d'accord » rapproche du pôle « rôle accru de l'État ». À la question suivante, ce pourrait être l'inverse.
3. **Chaque position a sa source.**
   - Parti A : appuie la mesure (plateforme, 2 septembre)
   - Parti B : s'oppose à la mesure (communiqué, 28 août)
   - Parti C : position non documentée. La question est retirée de son calcul, et vous en êtes informé.
4. **Le calcul est public.** Accord sur une question = 1 − |votre réponse − position du parti| ÷ 4.

**Appel**
[ Commencer la boussole ]
[N] questions · environ 10 minutes · vos réponses ne quittent pas votre appareil

---

## Ce que je fais différemment

J'ai utilisé des boussoles électorales et trois choses m'ont manqué. Voici ce que je fais à la place. Les documents d'un outil existant sont cités là où la comparaison aide à comprendre.

### 1. Le graphique de positionnement

**Le problème.** Sur un graphique, un parti apparaît à un endroit précis. Pour savoir pourquoi il est là plutôt que deux points plus loin, il faut pouvoir refaire le calcul avec les mêmes chiffres.

**Ce que je fais.** Chaque coordonnée est la moyenne des positions d'un parti sur les questions d'un axe, prise directement dans la matrice publiée. La formule est affichée à côté du graphique, et le calcul peut se refaire à la main. Un autre analyste, qui donnerait plus de poids à certaines questions ou les regrouperait autrement, placerait les points ailleurs. Le graphique est une manière de résumer, pas une mesure exacte.

**Pour comparer.** La Boussole électorale de Radio-Canada, conçue par Vox Pop Labs, décrit une autre méthode dans son document méthodologique : les axes sont dégagés par analyse factorielle, et les positions sont estimées par un modèle statistique dont les poids viennent d'un sondage pilote ([document de Vox Pop Labs](https://fichiers.voxpoplabs.com/boussole/methodologie.pdf), sections 4 et 6). Je n'ai pas trouvé, dans les documents publiés, les valeurs de ces poids pour l'édition québécoise 2026.

[Lien : la formule des coordonnées, méthodologie section 7]

### 2. La formulation des questions

**Le problème.** La façon de poser une question peut orienter la réponse. Si « d'accord » mène toujours du même côté, ou si l'énoncé contient déjà un jugement, le résultat dépend en partie de la rédaction.

**Ce que je fais.** Les règles de rédaction sont publiées et vérifiables :
- une seule mesure par question ;
- aucun adjectif qui juge ;
- aucun parti ni chef nommé ;
- un sens de « d'accord » qui alterne ;
- une échelle symétrique à cinq points ;
- une option « sans opinion » qui retire la question du calcul sans pénaliser personne.

La répartition des questions par thème et par axe est publiée, et les thèmes qui comptent moins de questions sont signalés, avec la raison. Un audit automatisé vérifie ces règles à chaque mise à jour, et son rapport est public.

**Pour comparer.** Vox Pop Labs décrit sa sélection des questions : études pilotes auprès d'environ 1 000 électeurs, jusqu'à une centaine de propositions testées, retenues selon leur capacité à distinguer les partis et la clarté de leur formulation ([document de Vox Pop Labs](https://fichiers.voxpoplabs.com/boussole/methodologie.pdf), section 2.1). Je n'y ai pas trouvé de règles de rédaction détaillées ni de rapport de vérification des énoncés.

[Lien : les règles de rédaction] · [Lien : le rapport de l'audit]

### 3. Les résultats et leur explication

**Le problème.** Un pourcentage de proximité dit à quel point vos réponses ressemblent à celles d'un parti. Il ne dit pas lesquelles ont fait pencher le résultat.

**Ce que je fais.** À la fin, un texte construit à partir de vos réponses dit :
- quelles réponses vous rapprochent de chaque parti ;
- lesquelles vous en éloignent ;
- sur quoi vous êtes en désaccord avec le ou les partis les plus proches. Cette section n'est jamais omise, même quand la proximité est élevée.

Le texte dit aussi ce qui a été retiré du calcul (vos « sans opinion », les positions non documentées) et l'effet des questions que vous avez marquées comme importantes. Deux partis à moins de 5 points d'écart sont présentés comme équivalents, et non comme premier et deuxième.

**Pour comparer.** Selon son document méthodologique, la Boussole de Radio-Canada donne accès, dans ses résultats, aux positions attribuées aux partis et aux déclarations qui les justifient, avec leurs liens ([document de Vox Pop Labs](https://fichiers.voxpoplabs.com/boussole/methodologie.pdf), section 2.3.1). Ce que j'ajoute : un texte qui classe vos réponses selon leur effet sur le résultat. Je n'ai pas consulté l'interface de leurs résultats, qui exige de remplir le questionnaire.

---

## Deux choix de méthode à connaître

Section courte. Ces deux choix vont dans une autre direction que ceux que décrit Vox Pop Labs, et je les assume.

- **Je ne consulte pas les partis.** Chaque position vient d'un texte publié par le parti, que tout le monde peut lire. Vox Pop Labs, lui, invite les partis à se positionner et arbitre les désaccords ([section 2.3.2](https://fichiers.voxpoplabs.com/boussole/methodologie.pdf)). Mon choix rend chaque position vérifiable par n'importe qui. Il a un coût : une position qu'un parti n'a pas écrite reste non documentée.
- **Une position non documentée est retirée du calcul, pas comptée comme neutre.** Vox Pop Labs code « Neutre » un parti qui « ne prend pas position de manière cohérente, reporte sa décision ou évoque la question de manière indirecte » (section 2.3.1). Ici, le calcul pour ce parti se fait sur les autres questions, et le résultat indique combien de questions ont compté.

---

## Ce que l'outil ne fait pas, et ce qui reste subjectif

**Il ne recommande aucun vote.** Il mesure l'écart entre vos réponses et des positions écrites, sur un nombre limité de mesures. Le bilan des partis, leurs équipes, la crédibilité de leurs engagements et vos candidates et candidats locaux n'y entrent pas.

**Il ne recueille aucune donnée.** Pas de compte, pas de cookie de suivi, pas d'outil de statistiques. Vos réponses restent dans votre navigateur ; elles ne sont conservées après la fermeture de l'onglet que si vous le demandez.

**Il reste subjectif, et voici où :**
- **Le choix des questions.** D'autres questions donneraient d'autres résultats. Les critères de choix sont publiés, mais le choix final est un jugement.
- **Le codage des positions.** Traduire un extrait de plateforme en « appuie en partie » ou « s'oppose » demande une lecture. Les cas où deux lectures se défendent sont signalés dans la matrice.
- **Qui fait le travail.** Le codage initial est préparé avec un assistant d'intelligence artificielle, puis vérifié et validé par une seule personne, l'éditeur du site. Il n'y a pas de comité de relecture.
- **Les thèmes inégaux.** Quand les partis n'ont pas tous pris position sur les mêmes mesures, un thème compte moins de questions, et il pèse donc moins dans le résultat.
- **Le calendrier.** Les plateformes se publient en cours de campagne. Les positions sont mises à jour, et chaque modification est datée.

[Lien : méthodologie complète] · [Lien : toutes les positions et leurs sources]

---

## Pied de page (commun à toutes les pages)

- Données à jour au [date]. Version [x.y].
- Méthodologie · Positions · Partis · À propos · Crédits
- Code et données publics : [lien vers le dépôt GitHub]
- Signaler une erreur : [lien]
- [Espace réservé : mention d'identification de l'éditeur, à remplir après vérification auprès du Directeur général des élections du Québec]

---

# PAGE /a-propos

## À propos

### Qui publie ce site
Ce site est publié par **Yanick Huet**[, de (ville) — à confirmer].

[À confirmer par Yanick Huet, et à ne publier que si c'est exact : « Je ne suis membre d'aucun parti politique et je ne travaille pour aucun d'eux. » Ajouter toute affiliation, tout emploi ou tout engagement pertinent.]

[À confirmer : financement. Par exemple : « Le site est financé par moi seul, sans commanditaire, publicité ni contribution d'un parti. » Préciser les coûts pris en charge : nom de domaine, hébergement.]

### Pourquoi
En utilisant des boussoles électorales, j'ai voulu pouvoir vérifier trois choses : d'où vient la position attribuée à chaque parti, comment les questions sont rédigées, et quelles réponses produisent le résultat. Ce site est ma façon d'y répondre : une méthode publiée avant la collecte des données, une matrice de positions où chaque case a sa source, et une explication réponse par réponse.

### Comment le travail est fait
- **Méthode publiée d'abord.** La méthodologie a été approuvée et publiée le 11 septembre 2026, avant la recherche des positions. Chaque modification ultérieure est datée et justifiée dans le journal des modifications. [lien]
- **Positions sourcées.** Chaque position vient d'un texte publié par le parti : plateforme, engagement, vote à l'Assemblée nationale, déclaration. L'URL, la date et un extrait sont fournis. Sans source, la position est déclarée non documentée.
- **Assistance d'intelligence artificielle.** La recherche des sources, le codage initial des positions et la veille quotidienne des annonces sont réalisés avec un assistant d'IA (Claude, d'Anthropic). Chaque position publiée est vérifiée et validée par moi. L'assistant propose ; il ne publie rien.
- **Code et données publics.** Tout le projet est dans un dépôt public : [lien GitHub]. N'importe qui peut relire la matrice, refaire l'audit et suivre l'historique.

### Vos données
Ce site ne recueille aucune donnée : pas de compte, pas de formulaire, pas de cookie de suivi, pas d'outil de statistiques. Vos réponses restent dans votre navigateur.

[À vérifier avant publication (voir A-VERIFIER.md) : comme pour tout site, l'hébergeur (Vercel) traite des journaux techniques de connexion. La phrase exacte sera fixée après lecture de sa politique de confidentialité.]

### Signaler une erreur
Une position vous semble mal attribuée, une source a changé, un extrait est inexact ? Indiquez :
1. la question concernée ;
2. le parti ;
3. l'adresse (URL) d'une source publiée par le parti ;
4. l'extrait qui justifie la correction.

Deux façons de le faire :
- **Dans le dépôt public**, en ouvrant un signalement : [lien vers les issues GitHub]. Il faut un compte GitHub, et le signalement est public.
- **Par courriel** : [adresse à confirmer].

Chaque correction acceptée est datée dans le journal des modifications, avec l'ancienne et la nouvelle source.

### Me joindre
[adresse courriel à confirmer]

### Identification
[Espace réservé : mention d'identification de l'éditeur, à remplir après vérification auprès du Directeur général des élections du Québec. Voir A-VERIFIER.md.]
