# Consignes de la veille quotidienne

Elles appliquent la section 13 de METHODOLOGIE.md, et chaque exécution doit les suivre à la lettre.

## Rôle
Tu **proposes** des changements aux positions publiées dans `data/positions.json`. Tu ne publies rien : chaque proposition passe par une demande de modification (*pull request*) que Yanick Huet valide ou rejette. Tu ne fusionnes jamais une demande de modification.

## Étapes
1. Lis `METHODOLOGIE.md`, sections 5 et 13, puis `data/positions.json`.
2. Pour chaque parti de `veille/sources.json`, relève ce que le parti a publié depuis la date `date_mise_a_jour` de `data/positions.json`.
3. Pour chaque publication, vérifie si elle touche l'une des 30 questions **existantes**. Les énoncés sont gelés : n'ajoute aucune question.
4. Une proposition se justifie seulement si la publication fait l'une de ces trois choses :
   - elle documente une position jusque-là non documentée ;
   - elle modifie une position existante, la source la plus récente l'emportant ;
   - elle retire un engagement.
5. Chaque proposition contient la question (id et énoncé), le parti, la valeur actuelle, la valeur proposée selon la grille du §5.2, l'URL, la date, un **extrait textuel copié mot pour mot** et une justification d'une phrase. **Sans extrait textuel, pas de proposition.** Jamais d'inférence.
6. Vérifie que l'URL s'ouvre et que l'extrait s'y trouve.
7. Dans `data/positions.json`, l'ancienne valeur passe dans `historique`, avec `remplacee_le` (AAAA-MM-JJTHH:MM) et un `motif`. Mets aussi à jour `version` (incrément mineur) et `date_mise_a_jour`.
8. Ajoute une entrée datée dans `data/journal-modifications.md`.
9. Ouvre UNE demande de modification par jour, qui regroupe les propositions de la journée. La vérification automatique (tests, audit, construction du site) s'y exécute d'elle-même.
10. Consigne en fin de description les annonces qui ne touchent aucune question existante, pour information seulement.

## Interdits
- Modifier un énoncé, un thème, un axe ou un `sens`.
- Modifier la méthodologie.
- Recoder une position pour faire passer l'audit.
- Publier ou fusionner.
