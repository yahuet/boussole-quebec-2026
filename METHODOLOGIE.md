# Méthodologie — Boussole électorale, élection générale québécoise du 5 octobre 2026

> **Statut : version 1.2, approuvée par Yanick Huet le 13 septembre 2026.** Version 1.0 approuvée le 11 septembre 2026. Les versions 1.0.1 et 1.0.2 corrigent deux points de calcul (sections 8 et 12). La version 1.1 permet une répartition inégale des questions entre les thèmes (sections 2.1, 2.3 et 12). La version 1.2 autorise les couleurs des partis dans les points des graphiques (section 11). Voir `data/journal-modifications.md`.
> Ce document a été publié **avant** la collecte des données : les règles ne peuvent pas être ajustées après coup en fonction des résultats. Toute modification ultérieure sera datée, justifiée et visible dans l'historique du dépôt.

Partis couverts, en ordre alphabétique des sigles : **CAQ** (Coalition avenir Québec), **PCQ** (Parti conservateur du Québec), **PLQ** (Parti libéral du Québec), **PQ** (Parti Québécois), **QS** (Québec solidaire).

---

## 0. En bref

| Élément | Choix |
|---|---|
| Questions de fond | De 25 à 30, au plus 3 par thème, 10 thèmes. Un thème peut en compter moins lorsque les partis n'ont pas tous pris position sur les mêmes mesures (§2.1) |
| Échelle | 5 points, de −2 à +2, plus « sans opinion » (question retirée du calcul) |
| Importance | « Compte beaucoup pour moi » double le poids de la question |
| Score par question | `1 − |réponse − position| / 4`, entre 0 et 1 |
| Proximité | Moyenne pondérée, calculée seulement sur les questions où le parti a une position documentée *et* où vous avez répondu |
| Codage des partis | 5 niveaux selon une grille stricte ; chaque valeur est justifiée par un extrait sourcé |
| Position introuvable | `null`, statut `non_documentee` ; retirée du calcul pour ce parti seulement, et signalée |
| Équivalence | Moins de 5 points d'écart : partis présentés comme équivalents |
| Axes | 3 axes (économique, constitutionnel, identitaire) ; graphique à 2 axes avec bascule |
| Question du chef | Posée à la fin, hors calcul, présentée comme un constat |
| Texte de fin | Assemblé de façon déterministe à partir de vos réponses ; aucun texte choisi dans une banque |
| Mises à jour | Veille quotidienne automatisée des sources officielles ; chaque changement est validé par une personne avant publication ; questions gelées au lancement |
| Retour des visiteurs | Réponses conservées sur l'appareil, sur demande seulement ; recalcul avec les données à jour et liste des positions modifiées |

---

## 1. Ce que l'outil mesure — et ce qu'il ne mesure pas

L'outil mesure **l'écart entre vos réponses et les positions écrites des partis** sur une série de mesures précises (de 25 à 30).

Il ne mesure pas :
- la crédibilité des engagements, ni la probabilité qu'ils soient réalisés ;
- le bilan d'un parti, la compétence de ses équipes ou la personnalité de ses chefs ;
- les enjeux qui ne figurent pas parmi les questions ;
- la candidature locale dans votre circonscription.

Le résultat n'est pas une recommandation de vote, et aucune partie de l'interface ne le présente comme telle.

L'outil couvre les cinq partis qui ont obtenu au moins 5 % des votes valides à l'élection générale de 2022. D'autres partis présentent des candidatures à cette élection.

**Propriété connue.** Sept des dix thèmes portent sur des politiques économiques et sociales (jusqu'à 21 questions). La proximité globale reflète donc surtout ces enjeux. C'est une conséquence du choix des thèmes, pas du calcul. Nous l'affichons dans la page méthodologie.

---

## 2. Thèmes, questions et axes

### 2.1 Thèmes

| # | Thème | Questions | Axe |
|---|---|---|---|
| 1 | Fiscalité et finances publiques | jusqu'à 3 | économique |
| 2 | Santé | jusqu'à 3 | économique |
| 3 | Éducation | jusqu'à 3 | économique |
| 4 | Économie et réglementation des entreprises | jusqu'à 3 | économique |
| 5 | Environnement et énergie | jusqu'à 3 | économique |
| 6 | Logement et habitation | jusqu'à 3 | économique |
| 7 | Services sociaux et organismes communautaires | jusqu'à 3 | économique |
| 8 | Question constitutionnelle | jusqu'à 3 | constitutionnel |
| 9 | Immigration et langue | jusqu'à 3 | identitaire, sauf exception (voir 2.2) |
| 10 | Laïcité et identité | jusqu'à 3 | identitaire |
| | **Total** | **de 25 à 30** | |

**Thèmes incomplets (version 1.1).** Chaque thème vise 3 questions. Un thème peut en compter moins, voire aucune, lorsque aucune autre mesure ne remplit les critères de la section 2.3, en particulier la couverture d'au moins 4 partis sur 5. Pour atteindre 3 questions, on n'abaisse pas le seuil de couverture et on ne retient pas de question sur laquelle tous les partis s'entendent.

Chaque thème incomplet est signalé publiquement, sur la page méthodologie et sur la page des données, avec la raison et les mesures examinées. Le total reste d'au moins 25 questions.

*Pourquoi.* Au 13 septembre 2026, après quatre passes de recherche, les partis n'avaient pas pris position sur les mêmes mesures dans certains thèmes. En services sociaux, les engagements de dépense faisaient consensus, et les mesures qui les opposent n'étaient documentées que pour 1 à 3 partis. Deux voies s'offraient pour atteindre 3 questions partout : abaisser le seuil de couverture, au prix de positions non documentées plus nombreuses, ou retenir des questions sans pouvoir discriminant. Elles auraient toutes deux réduit la fiabilité du résultat.

*Effet connu.* Un thème moins représenté pèse moins dans la proximité. Les critères A4 et A5 de l'audit continuent de vérifier qu'aucun parti n'en est favorisé ou désavantagé.

S'ajoute une question sur les chefs, qui n'entre pas dans le calcul (section 9).

### 2.2 Les trois axes

Chaque question appartient à **un seul** axe. Les axes servent uniquement à situer les réponses sur le graphique. Ils ne changent rien au calcul de proximité, qui traite toutes les questions à égalité.

| Axe | Pôle −1 | Pôle +1 | Questions |
|---|---|---|---|
| **Économique** | Rôle accru de l'État (dépenses publiques, réglementation, services publics) | Rôle accru du marché et du secteur privé (allègement fiscal, déréglementation, prestation privée) | selon les thèmes |
| **Constitutionnel** | Maintien ou renforcement du cadre fédéral | Autonomie accrue ou souveraineté du Québec | selon les thèmes |
| **Identitaire** | Latitude individuelle (port de signes religieux, services dans d'autres langues, seuils d'immigration plus élevés) | Règles communes (laïcité de l'État, exigences linguistiques, seuils d'immigration plus bas) | selon les thèmes |

**Pourquoi trois axes.** L'appui à la souveraineté et l'appui aux mesures de laïcité ou de langue ne vont pas forcément ensemble. Les fusionner sur un seul axe placerait au centre des partis qui ont en réalité des positions nettes, mais dans des directions différentes.

**Exception.** Une question du thème « immigration et langue » est classée sur l'axe *constitutionnel* seulement si elle porte sur le **partage des compétences** entre Québec et Ottawa (par exemple, le transfert d'un pouvoir). La répartition finale est fixée en phase 2 et vérifiée par l'audit.

Les libellés des pôles décrivent des mesures, pas des étiquettes idéologiques. L'interface n'emploie ni « gauche », ni « droite », ni « progressiste », ni « conservateur ».

**Convention du champ `sens`.** `sens = +1` signifie que répondre « d'accord » rapproche du pôle +1 de l'axe de la question. `sens = −1` signifie le contraire.

### 2.3 Critères de sélection des questions

Une question est retenue seulement si elle remplit **toutes** les conditions suivantes :

1. **Pertinence.** La mesure figure dans au moins une plateforme 2026, ou elle est débattue dans la campagne ou à l'Assemblée nationale pendant la législature actuelle.
2. **Pouvoir discriminant.** Au moins un parti a une position positive (> 0) et au moins un parti a une position négative (< 0). Une question sur laquelle les cinq partis s'entendent n'aide pas à distinguer les partis.
3. **Couverture au lancement.** Au moins **4 partis sur 5** ont une position documentée. Sinon, la question est remplacée par une autre du même thème ; faute de remplaçante, le thème reste incomplet (§2.1).
4. **Équilibre de l'ensemble.** Les contraintes de l'audit (section 12) sont respectées : répartition du `sens` et neutralité des profils uniformes.

Les questions écartées sont consignées dans `data/journal-modifications.md`, avec le motif du rejet.

**Ces critères s'appliquent jusqu'au lancement.** Ensuite, les énoncés sont gelés, et seules les positions des partis évoluent (section 13).

### 2.4 Ordre de présentation

L'ordre des questions est **fixe** pour tous, afin que les résultats soient reproductibles. Il est construit ainsi :
- les thèmes sont entremêlés, jamais trois questions du même thème de suite ;
- pas plus de deux questions consécutives du même axe avec le même `sens` ;
- les questions de laïcité et de question constitutionnelle ne sont pas en ouverture du questionnaire, pour limiter l'effet d'amorçage sur les réponses suivantes.

---

## 3. Règles de rédaction neutre des questions

1. **Une seule idée.** Jamais deux propositions liées par « et », « ainsi que », « de même que » ou « ou ». Seule exception : un « et » qui fait partie du nom officiel d'une institution. L'audit signale ces cas pour relecture humaine.
2. **Une mesure concrète et vérifiable.** Formule type : « Le Québec devrait… » ou « L'État québécois devrait… », suivie d'une action observable (hausser, abolir, interdire, créer, transférer, plafonner…). Jamais une valeur abstraite.
3. **Aucun adjectif ni adverbe évaluatif.** Liste d'exclusion minimale, vérifiée par l'audit : *excessif, insuffisant, nécessaire, dangereux, juste, injuste, raisonnable, équitable, abusif, légitime, essentiel, important, urgent, responsable, trop, assez, enfin, vraiment.*
4. **Aucun parti, aucun chef, aucun gouvernement désigné.** Les institutions peuvent être nommées (État québécois, gouvernement fédéral, Assemblée nationale, Hydro-Québec). Une formule comme « le gouvernement actuel » est interdite.
5. **Aucun numéro ni nom de loi associé à un parti.** On décrit le contenu de la mesure (« interdire le port de signes religieux au personnel enseignant du réseau public ») plutôt que son étiquette (« maintenir la loi 21 »). L'étiquette renvoie à un gouvernement, donc à un parti.
6. **Le statu quo comme point de référence, pas le chiffre d'un parti.** Si un énoncé reprend exactement le chiffre promis par un parti, ce parti obtient mécaniquement +2 et les autres des valeurs intermédiaires. On préfère donc « hausser au-delà du niveau actuel » à « fixer à X » quand X est le chiffre d'un seul parti.
7. **Formulation affirmative.** Pas de « ne devrait pas », sauf si la mesure est elle-même une interdiction. Pour inverser le `sens`, on propose la mesure du pôle opposé ; on ne nie pas la mesure.
8. **Contexte factuel.** Chaque question peut porter une note de contexte d'au plus deux phrases, sourcée, qui décrit la situation actuelle sans argument pour ou contre.
9. **Alternance délibérée du `sens`.** Voir la section 12 (critère A3).
10. **Test de la reformulation hostile.** Avant de retenir un énoncé, on vérifie que des personnes qui appuient chacun des cinq partis reconnaîtraient l'énoncé comme une description fidèle de la mesure, qu'elles l'approuvent ou non.

---

## 4. Échelle de réponse et traitement numérique

| Réponse | Valeur `a` |
|---|---|
| Tout à fait en désaccord | −2 |
| Plutôt en désaccord | −1 |
| Neutre | 0 |
| Plutôt d'accord | +1 |
| Tout à fait d'accord | +2 |
| **Sans opinion** | *retirée du calcul (section 8)* |

- **« Neutre » et « sans opinion » ne sont pas la même chose.** « Neutre » est une position mesurée : vous êtes au milieu. « Sans opinion » signifie que vous ne vous prononcez pas. L'interface l'explique en une phrase à la première question.
- **Importance.** La case « cette question compte beaucoup pour moi » fixe `w = 2`. Sinon, `w = 1`. La case n'est pas offerte avec « sans opinion ».
- Une question laissée sans réponse est traitée comme « sans opinion ».

---

## 5. Codage des positions des partis

La valeur `p` d'un parti indique **à quel point ce parti appuie la mesure telle qu'elle est formulée**. C'est la même échelle que celle de vos réponses (d'accord / en désaccord). Elle ne dépend pas de l'axe ni du `sens`.

### 5.1 Sources admissibles et ordre de priorité

Les sources admissibles sont, par ordre de priorité :

1. la **plateforme électorale officielle 2026** ;
2. un **engagement de campagne 2026** daté, publié par le parti (communiqué, site officiel, discours diffusé par le parti) ;
3. le **programme adopté** par les instances du parti (congrès, conseil national) ;
4. un **vote enregistré à l'Assemblée nationale** depuis l'élection du 3 octobre 2022 ;
5. une **déclaration officielle du parti** depuis le 3 octobre 2022.

**Règles de priorité**
- Quand deux sources se contredisent, la source la plus récente l'emporte. À date égale, la source de rang supérieur l'emporte. La contradiction est notée dans le champ `note`, et la source écartée y est citée.
- **Pendant la campagne**, une nouvelle annonce qui modifie une position remplace la valeur précédente. L'ancienne valeur et sa source restent dans l'historique (section 13.5). L'Assemblée nationale étant dissoute pendant la campagne, aucun nouveau vote enregistré n'est attendu avant le scrutin.
- **Un vote sur un projet de loi à plusieurs volets** n'est utilisé que si l'objet principal du projet de loi correspond à la question, ou si le parti a lui-même expliqué son vote sur ce volet précis.
- **Les décisions d'un gouvernement** (budget, règlement) ne comptent comme position de parti que si elles ont fait l'objet d'un vote enregistré, ou si elles sont reprises dans la plateforme ou un engagement de 2026.
- **Articles de presse** *(règle proposée, à valider)* : ils sont admis seulement s'ils rapportent une citation textuelle et datée du chef ou d'un porte-parole officiel. Ils sont alors marqués comme source secondaire dans l'interface. Une source primaire est toujours préférée.

**Signalements affichés à l'utilisateur**
- `anterieure_campagne` : la source date d'avant le déclenchement de la campagne 2026.
- `anterieure_chef` : la source date d'avant l'arrivée du chef actuel du parti.
- `source_secondaire` : article de presse rapportant une citation.

### 5.2 Grille de codage à 5 niveaux

| `p` | Critère — l'extrait cité doit le montrer |
|---|---|
| **+2** | Le parti s'engage à réaliser la mesure telle que formulée, ou une mesure qui la contient entièrement et va plus loin dans le même sens. |
| **+1** | Le parti appuie une version partielle de la mesure, l'assortit d'une condition explicite, ou l'appuie en principe sans engagement ferme. |
| **0** | Le parti propose explicitement une voie intermédiaire : ni la mesure, ni son contraire. *Ce cas doit rester rare.* |
| **−1** | Le parti s'oppose à une partie de la mesure ou sous condition, ou propose une mesure nettement plus limitée qui s'en éloigne. |
| **−2** | Le parti s'oppose explicitement à la mesure, ou s'engage à faire l'inverse. |

- Les valeurs ±1 et 0 **exigent un extrait qui montre la nuance**. Sans extrait qui la montre, la position est codée ±2 ou déclarée non documentée.
- « Nous allons étudier la question », « nous consulterons » : **non documentée**, motif `a_l_etude`. Cette réponse n'est pas codée 0.
- Le codage ne s'appuie **jamais** sur l'idéologie générale d'un parti, sur ses positions sur d'autres questions ou sur des déclarations de militants ou de candidats locaux.

**Codage et validation.** Chaque valeur est d'abord codée par un assistant d'IA (Claude, d'Anthropic), à partir des sources citées et selon cette grille. Elle est ensuite vérifiée et validée par **Yanick Huet**, responsable du projet. Aucune valeur n'est publiée sans cette validation. Les cas limites, où deux lectures raisonnables mènent à des valeurs différentes, sont listés dans le rapport de phase 2 et consignés dans le champ `note`.

### 5.3 Positions non documentées

- Valeur `null`, statut `non_documentee`, avec un motif : `aucune_source`, `sources_contradictoires` (contradiction de même date et de même rang) ou `a_l_etude`.
- La question est **retirée du calcul pour ce parti seulement**. Elle continue de compter pour les autres partis.
- Dans les résultats, les questions exclues sont listées pour chaque parti, avec le motif.
- **Interdit :** estimer, inférer ou imputer une valeur, qu'il s'agisse de la moyenne des autres partis, de la position de la famille idéologique ou de la position la plus probable.

### 5.4 Champs de traçabilité (`data/positions.json`)

Chaque position documentée porte les champs suivants :
- `valeur` (−2 à +2) et `statut` ;
- `type_source` : `plateforme` | `engagement` | `programme` | `vote` | `declaration` | `citation_presse` ;
- `source` : URL, ou référence exacte pour un vote (numéro du projet de loi, date, référence au Journal des débats ou au procès-verbal) ;
- `date` : date de la source ;
- `consulte_le` : date de consultation ;
- `extrait` : citation courte (au plus deux phrases), ou paraphrase explicitement marquée comme telle (`nature_extrait` : `citation` | `paraphrase`) ;
- `archive` : lien vers une copie archivée existante, s'il y en a une ;
- `drapeaux` : liste des signalements de la section 5.1 ;
- `note` : cas limite, contradiction, source écartée ;
- `historique` : les valeurs précédentes, avec pour chacune la valeur, la source, la date, la date de remplacement et le motif. Une modification n'efface jamais rien.

Chaque question porte les champs `id`, `theme`, `axe`, `sens`, `enonce`, `contexte` et `contexte_source`.

---

## 6. Calcul de la proximité

### 6.1 Formule

Pour une question `q`, notons `a_q` votre réponse, `w_q` sa pondération et `p_{k,q}` la position du parti `k`.

```
Score d'accord :  s_{k,q} = 1 − |a_q − p_{k,q}| / 4        (entre 0 et 1)

Base du parti k :  Q_k = { q : vous avez répondu (pas « sans opinion »)
                              ET p_{k,q} est documentée }

Proximité :       P_k = 100 × Σ_{q ∈ Q_k} w_q · s_{k,q}  /  Σ_{q ∈ Q_k} w_q
```

- `n_k = |Q_k|`, le nombre de questions réellement prises en compte, est **toujours affiché** à côté de `P_k`.
- `P_k` est **arrondie à l'entier** (,5 vers le haut). Aucune décimale n'est affichée.
- **Le dénominateur varie selon le parti.** C'est voulu : un parti dont la plateforme couvre moins de questions n'est pas pénalisé mécaniquement par ses positions manquantes.

**Lecture des scores.** 100 % signifie une réponse identique à la position du parti partout. 0 % signifie l'extrême opposé partout. Une réponse « neutre » face à une position ferme vaut 50 %. Dans la pratique, les scores tombent souvent entre 35 % et 75 % : **les écarts entre partis sont plus informatifs que les valeurs absolues**. L'interface le dit.

### 6.2 Exemple chiffré

| Question | Votre réponse | Poids | Parti A | s_A | Parti B | s_B |
|---|---|---|---|---|---|---|
| Q1 | +2 | 2 | +2 | 1,00 | −1 | 0,25 |
| Q2 | −1 | 1 | +1 | 0,50 | *non documentée* | — |
| Q3 | 0 | 1 | −2 | 0,50 | 0 | 1,00 |
| Q4 | sans opinion | — | +2 | — | −2 | — |

- A : (2×1,00 + 1×0,50 + 1×0,50) / (2+1+1) = 3,0 / 4 = **75 %**, sur 3 questions.
- B : (2×0,25 + 1×1,00) / (2+1) = 1,5 / 3 = **50 %**, sur 2 questions.
- Sans la pondération d'importance : A = 2,0 / 3 = **67 %**, B = 1,25 / 2 = **63 %** (62,5 arrondi). L'écart tombe à 4 points, et les deux partis deviennent **équivalents**. C'est ce qu'affiche le bloc « effet de l'importance » (section 6.4).

### 6.3 Groupes d'équivalence

Les regroupements se font sur les **scores arrondis affichés**, pour rester cohérents avec ce que vous voyez :

1. Le **groupe de tête** comprend le parti au score le plus élevé et tous les partis à **4 points ou moins** de lui, donc à moins de 5 points. Il n'y a pas d'enchaînement : si A = 70, B = 66 et C = 62, le groupe de tête est {A, B}, parce que C est à 8 points de A.
2. On forme ensuite les groupes suivants de la même façon, à partir du score le plus élevé parmi les partis restants.
3. **À l'intérieur d'un groupe, les partis sont présentés dans l'ordre aléatoire stable de la session**, pas par score. Le texte dit qu'ils sont à égale proximité et ne parle pas de premier ni de deuxième.

### 6.4 Effet de la pondération d'importance

Si vous avez coché au moins une question, les résultats affichent :
- la liste des questions cochées ;
- pour chaque parti, le score avec et sans pondération, et l'écart en points ;
- une phrase qui dit si la pondération a changé la composition du groupe de tête.

### 6.5 Seuils minimaux

- **Moins de 10 questions répondues** : aucun résultat de proximité n'est calculé. Un message explique pourquoi.
- **De 10 à 19 questions répondues** : les résultats sont affichés, avec un avertissement de base réduite.
- **`n_k` inférieur à 10 pour un parti** : son score n'est pas affiché, et la mention « trop peu de questions comparables » est indiquée à la place.

---

## 7. Coordonnées sur les axes

Pour un axe `X`, la coordonnée se calcule ainsi, sans pondération d'importance :

```
Vous :     x = ( Σ_{q ∈ X, répondue}      sens_q · a_q     ) / ( 2 · nb de questions de X répondues )
Parti k :  x = ( Σ_{q ∈ X, documentée}    sens_q · p_{k,q} ) / ( 2 · nb de questions de X documentées pour k )
```

Le résultat se situe entre −1 et +1.

- **Pourquoi sans pondération.** L'importance d'une question change à quel point elle compte pour vous, pas l'endroit où se situent vos idées. La pondération reste dans la proximité, pas dans la position sur le graphique.
- **Seuil.** Une coordonnée n'est calculée, pour vous comme pour un parti, que si **au moins la moitié** des questions de l'axe (arrondie au nombre supérieur) sont répondues ou documentées. Sinon, le point n'apparaît pas, et une mention l'explique.
- **Graphique.** Il croise l'axe économique et l'axe constitutionnel par défaut, avec une bascule vers l'axe économique et l'axe identitaire. Chaque extrémité porte le libellé de son pôle en toutes lettres.
- **Mise en garde affichée.** Une position au centre d'un axe peut vouloir dire des positions modérées, ou des positions nettes mais dans des directions différentes selon les questions. Le graphique résume. Il ne remplace pas le détail question par question.

---

## 8. Traitement de l'option « sans opinion »

- La question est retirée **du calcul de tous les partis**. Elle n'entre ni au numérateur ni au dénominateur. Il n'y a donc aucune pénalité : cela ne compte pas comme un désaccord, ni comme une réponse neutre.
- Elle est aussi retirée du calcul des coordonnées d'axe.
- Les résultats indiquent :
  - le nombre de questions laissées sans opinion, et leur liste ;
  - pour chacune, si les partis du groupe de tête et le parti suivant y ont des positions opposées (écart d'au moins 2 points entre leurs valeurs) ;
  - **l'intervalle de sensibilité** : l'écart minimal et l'écart maximal entre les deux partis comparés à la section 10.2.4, selon les réponses que vous auriez pu donner à ces questions (poids 1). Le calcul est exact, quel que soit le nombre de questions. Le poids d'une question ne dépend pas de la réponse choisie ; les dénominateurs sont donc fixes, et l'écart est une somme de termes indépendants, un par question. Prendre pour chaque question la réponse la plus favorable à un parti donne le même résultat que d'essayer toutes les combinaisons.

---

## 9. La question du chef

- Elle est **posée après les questions de fond**, sur un écran distinct : « Lequel de ces chefs ferait selon vous le meilleur premier ministre ? »
- Les choix sont présentés dans l'ordre aléatoire stable de la session, avec **le nom et le sigle du parti, sans photo**, dans une typographie identique. L'option « Aucun / je ne sais pas » est offerte.
- Pour un parti qui a plus d'une personne porte-parole, on présente la personne que le parti désigne officiellement pour le poste de premier ministre. La liste est vérifiée et sourcée en phase 2.
- **Elle n'entre pas dans le calcul.**
- Dans les résultats, un constat neutre est présenté, selon trois cas :
  - *Concordance* : « Vous avez choisi [chef], du [parti]. Ce parti fait partie du groupe de partis les plus proches de vos réponses ([P] %). »
  - *Écart* : « Vous avez choisi [chef], du [parti]. La proximité entre vos réponses et la plateforme de ce parti est de [P] %. Les partis les plus proches de vos réponses sont [groupe de tête]. »
  - *Aucun* : rien n'est affiché.

  Aucune formulation de correction, de surprise ou de reproche n'est employée (« pourtant », « malgré », « en réalité »…).

---

## 10. Le texte explicatif de fin

### 10.1 Principe de génération

- Le texte est **assemblé de façon déterministe** à partir de vos réponses, des positions et des sources. Des phrases à trous sont remplies par des données calculées. Il n'y a **aucun appel à une IA au moment de l'exécution**, et aucun paragraphe choisi dans une banque de textes.
- Avec les mêmes données (même version), les mêmes réponses produisent toujours le même texte. Chaque affirmation du texte renvoie à une question précise et au lien de sa source.
- Un agent d'IA sert uniquement à la **veille** des annonces (section 13.2), en amont de la publication : il repère les annonces et propose des changements, qu'une personne valide. Il n'intervient jamais dans le calcul ni dans le texte que vous lisez.
- Le ton est factuel, à la deuxième personne du pluriel, en français québécois. Le texte décrit ; il ne conseille pas.

### 10.2 Structure et règles de sélection

**1. Partis les plus proches.** Le texte nomme le groupe de tête, avec `P_k` et `n_k` pour chaque parti. S'il compte plusieurs partis, il indique qu'ils sont à égale proximité et que l'écart est trop faible pour les départager.

**2. Réponses qui vous ont le plus rapproché de chaque parti du groupe de tête.** On calcule d'abord la contribution distinctive de chaque question :

```
c_{k,q} = w_q × ( s_{k,q} − moyenne des s_{j,q} des autres partis documentés )
```

- On retient les questions où `s_{k,q} ≥ 0,75` et `c_{k,q} > 0`, triées par `c` décroissant.
- On en montre de 3 à 5 si le groupe de tête compte un seul parti, et 3 par parti s'il en compte plusieurs.
- Si moins de 3 questions remplissent ces conditions, on le dit.
- Pour chaque question, on affiche : l'énoncé, votre réponse, la position du parti (libellé et extrait), le lien vers la source, et une mention si vous avez coché « compte beaucoup ».

*Pourquoi une contribution distinctive :* une question où les cinq partis ont la même position que vous ne vous rapproche d'aucun parti en particulier.

**3. Vos désaccords avec chaque parti du groupe de tête.** *Section obligatoire, jamais omise.*
- On liste les questions où `|a − p| ≥ 2`, triées par `w × |a − p|` décroissant. On en affiche jusqu'à 5, suivies de la mention « et N autres » s'il y a lieu.
- S'il n'y en a aucune : on liste les écarts de 1 point, présentés comme des nuances.
- S'il n'y a aucun écart : on l'écrit explicitement, puis on liste les questions où la position du parti est non documentée et celles que vous avez laissées sans opinion. Ce sont autant de points où l'accord n'a pas pu être vérifié.

**4. Ce qui vous sépare du parti le plus proche suivant.**
- Si le groupe de tête compte **un seul parti**, on le compare au parti qui a le score le plus élevé parmi les autres.
- S'il en compte **plusieurs**, on compare les partis du groupe de tête entre eux.
- On retient les questions documentées pour les deux partis où `|s_A − s_B| ≥ 0,5`, c'est-à-dire où votre réponse est à au moins 2 points plus près de l'un que de l'autre. On les trie par `w × |s_A − s_B|` et on en affiche jusqu'à 5, **dans les deux sens** : celles qui vous rapprochent de A et celles qui vous rapprochent de B.

**5. Questions retirées du calcul.**
- *Sans opinion :* le nombre de questions, leur liste et leur effet, selon la section 8.
- *Positions non documentées :* pour chaque parti, les questions exclues et leur motif.
- *Effet de l'importance :* le contenu de la section 6.4.
- *Changements depuis votre dernière visite* (seulement si vous avez conservé vos réponses) : le contenu de la section 13.7.
- *Version des données :* le numéro et la date de la version utilisée (« données à jour au … »).

**6. Rappel.** « Cet outil mesure l'écart entre vos réponses et les positions écrites de cinq partis sur les N mesures du questionnaire. (N est le nombre de questions de la version des données.) Il ne tient pas compte des autres enjeux, du bilan des partis, de leurs équipes ni de vos candidates et candidats locaux. Ce n'est pas une recommandation de vote. »

### 10.3 Formulations interdites

L'audit vérifie que les gabarits de texte ne contiennent aucune de ces formulations :

> *vous devriez · nous recommandons · votre meilleur choix · le bon choix · fait pour vous · votre parti · vous êtes un électeur / une électrice de · vous appartenez · voter pour · idéal · parfait · pourtant · malgré · en réalité · vous êtes de gauche / de droite · progressiste · conservateur (comme qualificatif de la personne)*

---

## 11. Présentation visuelle

- **Ordre des partis.** Il est aléatoire et stable pour la session, tiré au premier affichage et conservé dans le stockage de session du navigateur (effacé à la fermeture de l'onglet, sans cookie). Il est tiré de nouveau à chaque session, même si vous avez conservé vos réponses. Il s'applique partout : barres de résultats, graphique, question du chef, matrice des positions, page des partis. Chaque page qui présente les partis indique que l'ordre est tiré au hasard pour la visite. Seule exception : la matrice des positions propose aussi l'ordre alphabétique des sigles, au choix.
- **Couleurs (version 1.2).** L'habillage du site n'emploie aucune couleur de parti : ni fond, ni accent, ni bouton, ni barre de résultat. Les couleurs des partis n'apparaissent qu'**à l'intérieur des points de données des graphiques**. Elles sont relevées sur les sites officiels des partis, et la source et la date du relevé sont publiées. Vos réponses ont une couleur d'accent qui ne correspond à aucun parti.
- **Graphique.** Chaque parti y est représenté par un point de même forme et de même taille, toujours accompagné de son sigle écrit : la couleur ne sert jamais seule à identifier un parti.
- **Chiffres.** Scores entiers, avec `n_k` visible à côté de chaque score.
- **Aucun élément graphique ne met un parti en valeur** : pas de médaille, de trophée, de couronne ou de « gagnant ». Un groupe de tête s'affiche comme un groupe.

---

## 12. Audit de neutralité : critères fixés d'avance

Le script `scripts/audit-neutralite.ts` échoue si l'un des critères bloquants n'est pas respecté. Il est exécuté avant le lancement, puis **à chaque mise à jour proposée** (section 13).

**Règle fondamentale.** Quand un critère échoue, la seule correction admise consiste à **revoir le choix ou la formulation des questions**. On ne recode **jamais** une position sourcée pour faire passer l'audit. Chaque correction est consignée dans `data/journal-modifications.md`.

| # | Critère | Seuil | Avant le lancement | Après le lancement |
|---|---|---|---|---|
| A1 | Questions par thème | Au plus 3 par thème ; total de 25 à 30 ; chaque thème de moins de 3 questions porte une note publique qui explique pourquoi (§2.1) | bloquant | bloquant |
| A2 | Questions par axe | Chaque question est sur l'axe de son thème. Seule exception : une question d'immigration sur le partage des compétences, classée sur l'axe constitutionnel et listée pour relecture. | bloquant | bloquant |
| A3 | Répartition du `sens` | Dans chaque axe, l'écart entre le nombre de +1 et de −1 est d'au plus 1. Dans chaque thème de 2 questions ou plus, les deux valeurs sont présentes. Sur l'ensemble, l'écart est d'au plus 2. | bloquant | bloquant |
| A4 | Profils uniformes | Pour les profils « tout +2 », « tout −2 » et « tout 0 » (poids 1, toutes les questions répondues), l'écart entre le score le plus haut et le plus bas est de **4 points ou moins** : les cinq partis tombent dans un seul groupe d'équivalence. | bloquant | alerte publique |
| A4b | Profils « tout +1 » et « tout −1 » | Scores rapportés | informatif | informatif |
| A5a | Couverture | Chaque question a au moins 4 positions documentées sur 5. Le nombre de positions non documentées par parti est rapporté. | bloquant | alerte publique |
| A5b | Effet des positions non documentées | Voir ci-dessous | bloquant | alerte publique |
| A6 | Rédaction des énoncés | Mots de la liste d'exclusion, sigles ou noms de partis et de chefs, numéros de loi : **bloquant**. « et », « ou », « ne… pas » : signalés pour relecture. | bloquant / signalement | bloquant |
| A7 | Gabarits du texte de fin | Aucune formulation de la section 10.3 | bloquant | bloquant |
| A8 | Intégrité de la traçabilité | Toute position documentée a une valeur entre −2 et +2, une source, une date, une date de consultation et un extrait. Toute position non documentée a un motif. Toute modification conserve la valeur précédente dans `historique`. | bloquant | bloquant |

**Avant et après le lancement.** Après le lancement, les questions sont gelées. Les critères A4 et A5 ne dépendent plus alors que de ce que les partis annoncent. Une position réelle n'est jamais retenue hors ligne pour préserver l'équilibre de l'audit. Si une mise à jour fait échouer A4 ou A5, elle est publiée quand même, et une **alerte publique** apparaît dans la page méthodologie : critère en échec, chiffres, date, mise à jour en cause. L'alerte disparaît quand le critère est de nouveau respecté. L'historique de ces alertes reste consultable.

**Ce que mesure A4, et ses limites.**
- Pour le profil « tout 0 », le score d'un parti ne dépend que de l'intensité moyenne de ses positions : ±2 donne 0,5, ±1 donne 0,75 et 0 donne 1. Un parti aux positions plus souvent nuancées obtient donc un score plus élevé. Le critère limite cet effet en contrôlant, question par question, les codages intermédiaires.
- Pour le profil « tout +2 », le score d'un parti dépend de la part des questions où il appuie la mesure telle que formulée. Alterner le `sens` ne suffit pas. Il faut que **chaque parti** soit favorable à environ la moitié des énoncés.

**Méthode de A5b.**
1. On simule 20 000 profils aléatoires : réponses uniformes sur les 5 points, 10 % de « sans opinion », 20 % des questions cochées « importante ».
2. Pour chaque profil et chaque parti, on calcule `P_k` de deux façons :
   - (i) sur la base normale du parti ;
   - (ii) sur la **base commune**, c'est-à-dire seulement les questions documentées pour les cinq partis.

   Les deux calculs se comparent sans le seuil d'affichage de 10 questions (§6.5). Sinon, une base commune plus petite masquerait tous les scores et ferait échouer le test par construction.
3. **L'audit échoue** si, pour un parti, l'une des deux conditions suivantes est remplie :
   - l'écart moyen signé entre (i) et (ii) dépasse **2 points** ;
   - la fréquence d'appartenance au groupe de tête diffère de plus de **5 points de pourcentage** entre (i) et (ii).

*Pourquoi cette méthode :* avec moins de questions, le score d'un parti varie davantage. Ce parti se retrouve alors plus souvent en tête, et plus souvent en queue. La base commune neutralise cet effet et permet de l'isoler.

**Mise en garde.** Avec des réponses aléatoires, les partis aux positions plus nuancées obtiennent en moyenne des scores plus élevés : en moyenne 0,65 pour une position ±1, contre 0,5 pour une position ±2. Cette fréquence est donc **rapportée, mais pas utilisée comme critère de neutralité**. Elle ne mesure pas un biais du questionnaire.

---

## 13. Mises à jour pendant la campagne

### 13.1 Ce qui change et ce qui ne change pas

| Élément | Après le lancement |
|---|---|
| Les énoncés, leur thème, leur axe, leur `sens` | **Gelés.** Une annonce sur un sujet non couvert n'ajoute pas de question. |
| Positions des partis (valeur, source, extrait) | Mises à jour selon la procédure ci-dessous |
| Note de contexte d'une question | Corrigée seulement en cas d'erreur factuelle, et consignée au journal |
| Méthode de calcul, seuils, grille de codage | **Gelés.** Toute modification serait publiée, datée et justifiée dans ce document. |

Le gel des énoncés garantit qu'un résultat obtenu à une date peut être comparé à un résultat obtenu à une autre date. Seules les positions des partis ont pu changer entre les deux, et ces changements sont listés.

### 13.2 Veille automatisée

- Un **agent planifié** s'exécute **une fois par jour**, et plus souvent les jours où les partis publient leur plateforme. Il consulte une **liste fermée et publiée de sources officielles** : salles de presse et plateformes des cinq partis, et articles de presse si la section 5.1 les admet. La liste est établie en phase 2.
- Pour chaque question et chaque parti, l'agent cherche si une annonce publiée depuis la dernière exécution :
  - documente une position jusque-là non documentée ;
  - modifie une position existante ;
  - ou retire un engagement.
- Chaque proposition comprend : la question, le parti, la valeur actuelle, la valeur proposée, l'URL, la date, un **extrait textuel** et la justification selon la grille de la section 5.2.
  - Sans extrait textuel, pas de proposition.
  - L'agent **ne propose jamais une valeur par inférence** ; les règles de la section 5 s'appliquent sans exception.
- Les propositions prennent la forme d'une **demande de modification** sur le dépôt du projet. L'audit (section 12) et la validation du format des données s'exécutent automatiquement sur chaque demande.
- L'agent consigne aussi, pour information interne seulement, les annonces qui portent sur des sujets hors questionnaire. Elles n'entraînent aucun changement, puisque les questions sont gelées.

### 13.3 Validation humaine

- **Rien n'est publié sans l'approbation de Yanick Huet**, responsable de la validation. L'agent ne peut ni approuver ni publier.
- La personne qui valide vérifie trois choses :
  1. le lien s'ouvre et mène à une source admissible ;
  2. l'extrait figure textuellement dans la source ;
  3. la valeur respecte la grille de codage.
- Une proposition peut être approuvée, modifiée ou rejetée. Un rejet est consigné avec son motif.
- L'approbation déclenche la reconstruction et le déploiement du site statique, qui prennent quelques minutes.

### 13.4 Délai visé

Une annonce publiée par un parti est intégrée **dans les 48 heures**, sous réserve de validation. Chaque page affiche la mention « Données à jour au [date et heure] ».

### 13.5 Historique

- Une position modifiée conserve toutes ses valeurs antérieures dans `historique`, avec leurs sources.
- La page « d'où viennent les données » affiche, pour chaque position modifiée, la mention « modifiée le … », la valeur précédente et un lien vers l'ancienne source.
- `data/journal-modifications.md` liste chronologiquement toutes les modifications publiées.

### 13.6 Versions

- Version **1.0** au lancement. Chaque lot de modifications approuvées incrémente la version : 1.1, 1.2, etc.
- La version et sa date sont affichées sur la page de résultats et sur la page des données.
- Toutes les versions restent consultables dans l'historique du dépôt public.

### 13.7 Recalcul pour les personnes qui reviennent

- Une case « Conserver mes réponses sur cet appareil » est **décochée par défaut**, avec cette mise en garde : « À éviter sur un appareil partagé. »
- Si vous la cochez, le navigateur conserve dans son stockage local (localStorage) : vos réponses, vos marques d'importance, votre choix de chef et la version des données utilisée. **Rien n'est envoyé à un serveur**, et aucun cookie n'est déposé.
- À votre retour, si la version des données a changé, les résultats sont recalculés avec les données à jour. Un bloc « Depuis votre dernière visite » indique :
  - la version précédente, la version actuelle et leurs dates ;
  - chaque position modifiée **sur une question à laquelle vous avez répondu** : parti, énoncé, ancienne et nouvelle valeur, lien vers la nouvelle source ;
  - l'effet sur vos scores, avant et après, en points entiers, et si la composition du groupe de tête a changé.

  Ce bloc garde le même ton factuel que le reste du texte (section 10.3).
- Un bouton « Effacer mes réponses de cet appareil » est toujours visible.

### 13.8 Fin de la campagne

- Les mises à jour se poursuivent jusqu'au **4 octobre 2026 inclusivement**.
- Après le scrutin, la dernière version est gelée et reste en ligne comme archive, avec la mention « Version finale — données au [date] ».

### 13.9 Transparence sur la veille

La page méthodologie indique trois choses :
- un agent d'IA assure la veille et le codage initial ;
- cet agent ne fait que proposer des changements ;
- chaque changement publié a été validé par Yanick Huet.

Le journal indique, pour chaque modification, sa date de validation.

---

## 14. Transparence, corrections et versions

- **Dépôt public.** Tout le projet est dans un dépôt GitHub public, relié à Vercel : code, données, méthodologie, script d'audit, journal. N'importe qui peut y consulter l'historique complet des modifications, reproduire l'audit et relire chaque proposition de la veille.
- `data/positions.json` porte un numéro de `version` et une `date_mise_a_jour` (voir la section 13.6). La page de résultats affiche la version utilisée.
- La page « d'où viennent les données » affiche la matrice complète : chaque valeur, chaque extrait, chaque lien, chaque signalement, chaque note et l'historique des modifications.
- `data/journal-modifications.md` consigne toute modification datée : questions écartées avant le lancement, positions ajoutées ou modifiées avec la source nouvelle et l'ancienne, propositions rejetées avec leur motif, alertes d'audit.
- **Demandes de correction :** par les *issues* du dépôt GitHub public (voir la section 15). Une correction n'est intégrée que sur présentation d'une source admissible au sens de la section 5.1. Elle suit le même circuit de validation que les propositions de la veille.

---

## 15. Décisions

| Point | Décision |
|---|---|
| Validation des positions et des mises à jour | Yanick Huet, seul responsable de la validation (sections 5.2 et 13.3) |
| Dépôt | GitHub, public, relié à Vercel (section 14) |
| Calendrier | Lancement le plus tôt possible |
| Critère de sélection des cinq partis | Partis ayant obtenu au moins 5 % des votes valides à l'élection générale du 3 octobre 2022, selon les résultats officiels d'Élections Québec. Ce critère est vérifiable et ne dépend pas des sondages. Les chiffres exacts sont cités dans les données. |
| Articles de presse | Admis comme source secondaire, avec signalement, seulement s'ils rapportent une citation textuelle et datée du chef ou d'un porte-parole officiel (section 5.1) |
| Demandes de correction | Par les *issues* du dépôt GitHub public, à l'aide d'un modèle qui exige l'URL de la source et l'extrait. Une adresse courriel dédiée pourra s'ajouter plus tard. |
| Date de référence de la campagne | La date officielle du déclenchement, citée dans les données |
