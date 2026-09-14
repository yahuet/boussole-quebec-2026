# La boussole des élections — Québec 2026

Site : boussoleelection.ca

Outil d'information indépendant pour l'élection générale québécoise du 5 octobre 2026.

Vous répondez à une série de questions (de 25 à 30) sur des mesures de politique publique. L'outil indique de quelles plateformes vos réponses se rapprochent, et explique pourquoi, réponse par réponse. Il montre aussi vos points de désaccord avec le ou les partis les plus proches.

Partis couverts : CAQ, PCQ, PLQ, PQ, QS.

## Principes

- **Méthodologie publiée avant les données.** Toutes les règles sont dans [METHODOLOGIE.md](METHODOLOGIE.md) : choix des questions, calcul, codage des positions, audit de neutralité.
- **Chaque position est sourcée.** Chaque position attribuée à un parti renvoie à une source primaire vérifiable, avec la date et un extrait. Sans source, la position est déclarée non documentée ; elle n'est jamais estimée.
- **Aucune collecte de données.** Site statique, sans compte, sans cookie de suivi, sans analytique. Vos réponses restent dans votre navigateur.
- **Ce n'est pas une recommandation de vote.** L'outil mesure un écart entre des réponses et des plateformes écrites.

## État du projet

| Phase | État |
|---|---|
| 1. Méthodologie | Approuvée le 11 septembre 2026 (version 1.2 le 13 septembre) |
| 2. Matrice des positions sourcées | En cours : positions validées au 13 septembre ; fiscalité à compléter après les cadres financiers |
| 3. Application | Moteur de calcul, texte explicatif et pages en place ; nouveau design en cours |
| 4. Audit de neutralité | Script en place (`scripts/audit-neutralite.ts`) |

## Signaler une erreur

Ouvrez une *issue* en indiquant la question, le parti, l'URL de la source et l'extrait qui justifie la correction. Voir la section 14 de la méthodologie.

## Responsable

Yanick Huet, Hinchinbrooke. Contact : info@boussoleelection.ca. Le codage initial et la veille des annonces sont faits avec l'aide d'un assistant d'IA (Claude, d'Anthropic). Chaque position publiée est validée par le responsable.
