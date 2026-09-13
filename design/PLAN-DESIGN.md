# Plan de design — boussoleelection.ca

Étape A, soumise pour validation le 13 septembre 2026. Aucune ligne de code avant l'étape C.

---

## 0. Cinq points à trancher avant tout

Ta demande contredit à quelques endroits la méthodologie publiée (version 1.1) ou le code existant. Je ne tranche pas à ta place ; voici les écarts.

1. **« Nombre égal de questions par axe et par thème »** (constat 2) : c'est inexact.
   - Les axes n'ont jamais eu le même nombre de questions : 7 thèmes sur 10 relèvent de l'axe économique.
   - Depuis la version 1.1 (13 septembre), un thème peut compter moins de 3 questions.

   L'accueil ne peut pas promettre l'égalité. Formulation proposée : « la répartition des questions par thème et par axe est publiée, et les thèmes incomplets sont signalés ».
2. **« Le parti arrivé premier »** (constat 3) : la méthodologie ne classe pas les partis à moins de 5 points d'écart ; elle les présente comme équivalents (§6.3). Formulation proposée : « sur quoi vous êtes en désaccord avec le ou les partis les plus proches ».
3. **L'ordre alphabétique partout** contredit le §11 actuel, qui prévoit un ordre aléatoire stable par session.
   - L'ordre alphabétique est plus transparent et identique pour tous, mais il place toujours la CAQ en premier. Un effet de position est documenté pour les bulletins de vote.
   - Si tu confirmes, je modifie le §11 (version 1.2) et le code.
4. **Les couleurs de partis dans les graphiques** contredisent aussi le §11, qui prévoit une même teinte neutre pour tous les partis. Si tu confirmes, je le modifie. Les couleurs retenues seront sourcées (section 1.3) et vérifiées pour qu'aucune ne ressorte davantage que les autres.
5. **Arborescence.** Le code existant utilise `/questionnaire`, `/resultats` et `/donnees`. Correspondance proposée : `/boussole` pour le questionnaire, **`/boussole/resultats`** pour les résultats (absents de ta liste) et `/positions` pour la matrice. Les portraits restent **absents** de la question du chef dans le questionnaire (§9 : « nom et sigle, sans photo »). Ils ne figurent que sur `/partis`.

---

## 1. Palette

### 1.1 Valeurs proposées

Toutes les valeurs ont été vérifiées pour le contraste (WCAG 2.1), sur le fond et avec du blanc dessus.

| Nom | Valeur | Rôle | Contraste |
|---|---|---|---|
| **Bleu fleuve** | `#1F4E6E` | Ancrage : titres, liens, boutons, bandeau d'en-tête, anneau de focus | 8,25:1 sur le fond ; blanc dessus 8,85:1 |
| **Fond** | `#F5F7FA` | Fond de page | — |
| **Ardoise** | `#232B36` | Texte courant | 13,3:1 sur le fond |
| **Vert-de-gris** | `#356A66` | **Accent unique** (rôle en 1.2) | 5,75:1 sur le fond ; blanc dessus 6,17:1 |
| **Gris d'étain** | `#5E6773` | Métadonnées : dates, types de source, légendes | 5,34:1 sur le fond |
| **Trait** | `#7B8591` et `#D5DBE3` | Bordures de composants interactifs (3,49:1, au-dessus du minimum de 3:1 du critère 1.4.11) ; filets décoratifs | — |

Blanc pur `#FFFFFF` pour les surfaces de lecture (fiches, tableaux). Aucun dégradé.

### 1.2 Rôle unique de l'accent

**Le vert-de-gris désigne ce qui vient de vous, et seulement ça.** Il colore votre réponse sélectionnée, votre point sur le graphique, votre barre de progression, et la ligne « Votre réponse » dans les explications.

Ni les liens, ni les boutons, ni les titres ne l'utilisent. La règle est ainsi vérifiable d'un coup d'œil : là où il y a du vert, c'est vous ; là où il y a du bleu, c'est l'outil.

### 1.3 Pourquoi pas `#095797` ni `#0B3C7A`

J'ai relevé le 13 septembre 2026 les couleurs dominantes des sites officiels des partis. Méthode : styles calculés des pages d'accueil, plus les feuilles de style téléchargées.

| Parti | Couleurs relevées | Source |
|---|---|---|
| CAQ | cyan `#00B3F1` | https://coalitionavenirquebec.org/fr/ |
| PCQ | marine `#172852`, bleu `#2EA3F2` | https://conservateur.quebec/ |
| PLQ | rouge `#ED1C2E`, marine `#111F3B` | https://plq.org/ |
| PQ | marine `#1E295C`, bleu `#1863DC` | https://pq.org/ |
| QS | mauve `#6C0985`, jaune `#F9BF09`, vert `#216743` | https://quebecsolidaire.net/ |

**Ce que ce relevé montre.** Ce relevé technique ne remplace pas les chartes graphiques des partis ; il sera à confirmer avant de s'en servir dans les graphiques.
- **Trois partis** (PQ, PCQ, PLQ) utilisent un **bleu marine très sombre et saturé** (teinte 220–229°, luminosité 15–24 %). `#0B3C7A` (214°, 26 %) tombe dans cette famille.
- `#095797` est le bleu signature du gouvernement du Québec, ce qui ferait gouvernemental et risquerait d'être pris pour un site officiel.
- `#1F4E6E` (204°, saturation 56 %, luminosité 28 %) reste un bleu du Québec, **plus grisé et plus « eau »**. Il est nettement moins saturé que les bleus vifs de la CAQ et du PCQ, et plus clair et plus vert que les marines du PQ, du PCQ et du PLQ.
- Le vert-de-gris `#356A66` (175°, saturation 33 %) se distingue du vert de QS (149°, 51 %).
- **Le violet actuel du prototype (`#6D28D9`) est à retirer** : il évoque le mauve de QS.

### 1.4 Graphiques

Dans les graphiques, et seulement à l'intérieur des points de données (si tu confirmes le point 0.4) :
- chaque parti porte sa couleur relevée, **plus son sigle écrit à côté** : on ne se fie jamais à la couleur seule (critère 1.4.1) ;
- tous les points ont la même taille et la même forme ;
- votre point est un losange vert-de-gris.

---

## 2. Typographie — deux options

Les deux options respectent tes contraintes :
- polices libres (SIL OFL), **auto-hébergées** : aucun serveur externe ;
- variantes variables pour limiter le poids ;
- couverture latine étendue.

La couverture de É, À, Ç, Ù et Œ est attestée dans leurs jeux de caractères publiés. **Je la vérifierai à l'œil** à l'étape C, sur les vrais titres du site (« Économie et réglementation », « À propos », « Ça compte », « Où se situent vos réponses », « Œuvres citées »), à 360 px et à 1 440 px. Si une capitale accentuée est bâclée, je te le signale avant de continuer.

### Option 1 — Une seule famille : Atkinson Hyperlegible Next
- Dessinée pour le Braille Institute, pour les lecteurs à basse vision. Les caractères qu'on confond (I, l, 1 ; 0, O ; rn, m) sont différenciés. Registre neutre, ni technologique ni gouvernemental.
- Graisses 400, 600 et 700 pour tout le site ; chiffres tabulaires pour les pourcentages et les tableaux.
- **Pour :** lisibilité maximale sur téléphone pour une personne de 70 ans, une seule famille, cohérence.
- **Contre :** moins de relief pour les longs textes de méthodologie ; titres et texte se distinguent seulement par la taille et la graisse.

### Option 2 — Deux familles : Source Serif 4 (titres) et Source Sans 3 (texte)
- Superfamille d'Adobe, conçue pour l'édition. Le serif a des tailles optiques : les grands corps ne tombent pas dans le « serif à fort contraste » décoratif. Le sans est très lisible à petite taille.
- Registre : **document de référence** plutôt qu'application, ce qui convient à un site dont le cœur est une méthode et une matrice de sources.
- **Pour :** hiérarchie claire entre titres et texte ; tenue sur les pages longues (méthodologie, positions).
- **Contre :** deux fichiers de plus à charger ; le serif est moins lisible que l'option 1 aux très petites tailles (il ne servira donc qu'aux titres).

**Recommandation :** l'**option 1**. Une grande partie des visites viendra de liens texto ouverts sur téléphone, souvent par des personnes qui ne lisent pas beaucoup à l'écran. La lisibilité passe avant le relief.

### Échelle (commune aux deux options)
Corps de base **18 px** (au-delà des 16 px habituels), rapport 1,25, arrondi.

| Jeton | Mobile | Bureau | Usage |
|---|---|---|---|
| `petit` | 15 px / 1,5 | 15 px | Métadonnées, sources. Jamais moins de 15 px. |
| `corps` | 18 px / 1,6 | 18 px / 1,65 | Texte courant |
| `h4` | 20 px / 1,35 | 20 px | Intertitres de fiche |
| `h3` | 23 px / 1,3 | 24 px | |
| `h2` | 27 px / 1,25 | 30 px | |
| `h1` | 32 px / 1,2 | 40 px | Un seul par page |

- **Longueur de ligne :** `max-width: 66ch` pour le texte courant, soit environ 66 caractères (moins de 80) ; `72ch` au plus pour les tableaux de texte.
- **Pas d'étiquettes en majuscules espacées** au-dessus des titres. Les rares libellés de catégorie sont en petites minuscules, sans espacement ajouté.

---

## 3. Motif

**Fleur de lys : je recommande de ne pas l'utiliser.**
- Elle est l'emblème du Québec, mais dans une campagne où l'un des axes du questionnaire est « constitutionnel » et un autre « identitaire », son usage appuyé peut se lire comme un positionnement.
- Si tu la veux quand même : un seul usage structurel, en filet de 12 px gris d'étain qui sépare le pied de page du contenu, sans reprise ailleurs.
- Pas de fleurdelisé, pas de lys dans le logo.

**Signature visuelle proposée à la place : le renvoi de source.**
- Chaque affirmation vérifiable porte un petit renvoi uniforme : type de source et date, en gris d'étain, soulignement pointillé bleu fleuve. Il ouvre la source.
- Ce même élément revient partout : accueil, positions, résultats, fiches de partis.
- C'est le seul « motif » du site, et il dit ce que fait l'outil.

---

## 4. Trois idées de hero

1. **La question disséquée.** L'ouverture montre une vraie question du questionnaire, avec des positions de **partis fictifs** (Parti A à E), annotée en quatre repères :
   - l'énoncé ;
   - le sens (« d'accord » rapproche de tel pôle) ;
   - les positions et leurs renvois de source ;
   - le calcul `1 − |réponse − position| ÷ 4`.

   D'un coup d'œil, on voit que chaque réponse est traçable.
2. **La formule d'abord.** La première ligne de la page est la formule de proximité, composée en grand et annotée en langage courant, puis « Toutes les règles sont publiques » et le lien pour commencer.
3. **Le résultat expliqué.** L'ouverture montre un extrait de résultat fictif : « Ce qui vous rapproche », « Vos désaccords », « Ce qui a été retiré du calcul ». L'explication réponse par réponse est le produit ; le pourcentage n'en est qu'une ligne.

**Recommandation : l'idée 1.** C'est la seule qui montre les trois différences à la fois : source, règles de rédaction, calcul. Les idées 2 et 3 n'en montrent qu'une. Sur téléphone, les repères s'empilent verticalement sous la question.

---

## 5. Gabarits partagés

- **Largeur de contenu :** 66ch pour le texte ; 1 120 px au plus pour les grilles (partis, positions).
- **Pas de suites de cartes arrondies à ombre grise.**
  - Les fiches sont délimitées par un filet de 1 px (`#D5DBE3`) sur fond blanc, avec des coins droits ou un rayon de 2 px, sans ombre.
  - Les listes de contenu sont des listes, pas des cartes.
- **Pas de flèches « → » collées aux liens.** Les liens sont soulignés ; les boutons sont des boutons.
- **Pas d'animations d'entrée.** Seules transitions : le focus et l'état pressé (≤ 120 ms), désactivées avec `prefers-reduced-motion`.
- **Focus clavier :** anneau de 3 px bleu fleuve, décalé de 2 px sur un liseré blanc, visible sur tous les fonds.
- **Cibles tactiles :** au moins 48 × 48 px (au-delà du minimum de 44 px).

### Gabarit « parti » (identique pour les cinq)
| Élément | Règle fixe |
|---|---|
| Ordre | Alphabétique par sigle, indiqué en toutes lettres : « Partis en ordre alphabétique de sigle : CAQ, PCQ, PLQ, PQ, QS » |
| Logo | Boîte de 160 × 80 px (mobile 128 × 64), `object-fit: contain`, sur panneau blanc, marge interne fixe. Jamais recolorée. |
| Portrait | Ratio 4:5, cadrage tête et épaules, **deux tailles : 320 × 400 et 640 × 800**, AVIF/WebP. Aucun détourage ni remplacement de fond : les licences l'interdisent parfois (voir l'étape D), et c'est une modification de la photo. Même cadre et même panneau `#E8EEF3` pour les cinq. |
| Absence d'image | Monogramme neutre aux mêmes dimensions : sigle (logo) ou initiales (portrait), en ardoise sur `#E8EEF3` |
| Résumé factuel | **Exactement 70 mots**, vérifiés par un test automatisé. Chaque fait est lié à sa source. Même structure pour les cinq : fondation, chef et date d'entrée en fonction, résultat de 2022, documents de programme publiés. |
| Liens | Mêmes trois liens, dans le même ordre : site officiel ; positions de ce parti dans la matrice ; source du résumé |

---

## 6. Wireframes

### 6.1 Accueil — mobile (360 px)

```
┌──────────────────────────────────────┐
│ Boussole électorale 2026        Menu │  ← bandeau bleu fleuve, texte blanc
├──────────────────────────────────────┤
│                                      │
│ Comparez vos idées aux plateformes   │  h1 32 px
│ des partis, en voyant d'où vient     │
│ chaque position.                     │
│                                      │
│ ┌──────────────────────────────────┐ │  HERO : la question disséquée
│ │ Exemple (partis fictifs)         │ │  (petit, gris d'étain)
│ │                                  │ │
│ │ « Le Québec devrait … »          │ │  ① L'énoncé
│ │ ① Une seule mesure, sans         │ │
│ │   adjectif qui juge.             │ │
│ │                                  │ │
│ │ ② « D'accord » rapproche du      │ │  ② Le sens
│ │   pôle « rôle accru de l'État ». │ │
│ │   À la question suivante, c'est  │ │
│ │   l'inverse.                     │ │
│ │                                  │ │
│ │ ③ Parti A  Appuie ··· plateforme │ │  ③ Positions et renvois de source
│ │    Parti B  S'oppose ··· vote    │ │     (pointillé = lien)
│ │    Parti C  Non documentée       │ │
│ │                                  │ │
│ │ ④ Accord = 1 − |r − p| ÷ 4       │ │  ④ Le calcul
│ └──────────────────────────────────┘ │
│                                      │
│ [ Commencer la boussole ]            │  bouton bleu fleuve, pleine largeur
│ 25 à 30 questions · 10 minutes ·     │  petit
│ rien ne quitte votre téléphone       │
│                                      │
├──────────────────────────────────────┤
│ Ce que je fais différemment          │  h2
│                                      │
│ Le graphique de positionnement       │  h3
│ Le problème : …                      │
│ Ce que je fais : …                   │
│ [lien : la formule des coordonnées]  │
│                                      │
│ La formulation des questions         │  h3
│ Le problème : …                      │
│ Ce que je fais : …                   │
│ [lien : rapport de l'audit]          │
│                                      │
│ Les résultats sans explication       │  h3
│ Le problème : …                      │
│ Ce que je fais : …                   │
├──────────────────────────────────────┤
│ Ce que l'outil ne fait pas           │  h2 (limites, court)
│ • Il ne recommande aucun vote.       │
│ • Il ne recueille aucune donnée.     │
│ • Il reste subjectif : …             │
├──────────────────────────────────────┤
│ Données à jour au 17 sept. 2026      │  petit
│ Méthodologie · Positions · Partis    │
│ À propos · Crédits                   │
│ [ Mention d'identification de        │  ← espace réservé (étape légale)
│   l'éditeur — à remplir ]            │
└──────────────────────────────────────┘
```

### 6.2 Accueil — bureau (1 280 px)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Boussole électorale 2026     Boussole  Méthodologie  Positions  Partis  À propos │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Comparez vos idées aux plateformes      ┌────────────────────────────────────┐ │
│  des partis, en voyant d'où vient        │ Exemple (partis fictifs)           │ │
│  chaque position.                        │                                    │ │
│                                          │ « Le Québec devrait … »       ①    │ │
│  Une question à la fois. Pour chaque     │ ─────────────────────────────────  │ │
│  parti, la position vient d'un texte     │ « D'accord » → pôle État      ②    │ │
│  publié, avec le lien. À la fin, une     │ ─────────────────────────────────  │ │
│  explication réponse par réponse.        │ Parti A  Appuie    ·· plateforme ③ │ │
│                                          │ Parti B  S'oppose  ·· vote         │ │
│  [ Commencer la boussole ]               │ Parti C  Non documentée            │ │
│  25 à 30 questions · environ 10 minutes  │ ─────────────────────────────────  │ │
│  Aucune donnée recueillie                │ Accord = 1 − |r − p| ÷ 4      ④    │ │
│                                          └────────────────────────────────────┘ │
│  (colonne de texte 5/12)                  (schéma 7/12 ; repères en marge)       │
├───────────────────────────────────────────────────────────────────────────────┤
│  Ce que je fais différemment                                                    │
│                                                                                 │
│  1. Le graphique        │ 2. La formulation       │ 3. Les résultats           │
│  Le problème : …        │ Le problème : …         │ Le problème : …            │
│  Ce que je fais : …     │ Ce que je fais : …      │ Ce que je fais : …         │
│  [la formule]           │ [rapport d'audit]       │ [exemple fictif]           │
│  (colonnes séparées par un filet vertical, pas des cartes)                      │
├───────────────────────────────────────────────────────────────────────────────┤
│  Ce que l'outil ne fait pas              │  D'où viennent les données          │
│  • aucune recommandation de vote         │  CAQ · PCQ · PLQ · PQ · QS          │
│  • aucune donnée recueillie              │  (ordre alphabétique de sigle)      │
│  • la subjectivité qui reste : …         │  [Voir la matrice des positions]    │
├───────────────────────────────────────────────────────────────────────────────┤
│  Pied de page : données à jour · liens · espace réservé d'identification        │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 /partis — mobile (360 px)

```
┌──────────────────────────────────────┐
│ Boussole électorale 2026        Menu │
├──────────────────────────────────────┤
│ Les cinq partis                      │  h1
│ Partis présentés en ordre            │
│ alphabétique de sigle. Chaque fiche  │
│ a le même gabarit et un résumé de    │
│ 70 mots.                             │
│ Pourquoi ces cinq partis ? [lien]    │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ ┌──────────┐                     │ │  logo 128×64, contain, panneau blanc
│ │ │   LOGO   │  Coalition avenir   │ │
│ │ └──────────┘  Québec (CAQ)       │ │  h2
│ │ ┌──────────┐                     │ │
│ │ │          │  Cheffe :           │ │  portrait 4:5 (160×200 affiché)
│ │ │ PORTRAIT │  Christine Fréchette│ │  ou monogramme « CF »
│ │ │   4:5    │  depuis le 12 avril │ │
│ │ │          │  2026 ··· source    │ │
│ │ └──────────┘                     │ │
│ │ Résumé (70 mots, chaque fait     │ │
│ │ lié à sa source) …               │ │
│ │                                  │ │
│ │ Site officiel                    │ │  3 liens, même ordre pour tous
│ │ Positions de ce parti            │ │
│ │ Sources du résumé                │ │
│ │ Crédit photo : … (licence)       │ │  petit
│ └──────────────────────────────────┘ │
│ (PCQ, même gabarit)                  │
│ (PLQ, même gabarit)                  │
│ (PQ, même gabarit)                   │
│ (QS, même gabarit)                   │
└──────────────────────────────────────┘
```

### 6.4 /partis — bureau (1 280 px)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Les cinq partis                                                                 │
│ Partis présentés en ordre alphabétique de sigle. Même gabarit, résumé de        │
│ 70 mots pour chacun.                                                            │
├───────────────┬───────────────┬───────────────┬───────────────┬───────────────┤
│ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │
│ │   LOGO    │ │ │   LOGO    │ │ │   LOGO    │ │ │   LOGO    │ │ │   LOGO    │ │  160×80 identiques
│ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────┘ │
│ CAQ           │ PCQ           │ PLQ           │ PQ            │ QS            │
│ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │
│ │ PORTRAIT  │ │ │ PORTRAIT  │ │ │ PORTRAIT  │ │ │ PORTRAIT  │ │ │ PORTRAIT  │ │  4:5 identiques
│ │   4:5     │ │ │   4:5     │ │ │   4:5     │ │ │   4:5     │ │ │   4:5     │ │
│ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────┘ │
│ Chef, date,   │ …             │ …             │ …             │ …             │
│ source        │               │               │               │               │
│ Résumé de     │ Résumé de     │ Résumé de     │ Résumé de     │ Résumé de     │  même hauteur de
│ 70 mots       │ 70 mots       │ 70 mots       │ 70 mots       │ 70 mots       │  bloc (grille alignée)
│ 3 liens       │ 3 liens       │ 3 liens       │ 3 liens       │ 3 liens       │
│ Crédit photo  │ Crédit photo  │ Crédit photo  │ Crédit photo  │ Crédit photo  │
└───────────────┴───────────────┴───────────────┴───────────────┴───────────────┘
  (5 colonnes égales à ≥ 1 200 px ; 2 colonnes, puis 1, en dessous, toujours dans le même ordre)
```

---

## 7. Relecture critique : ce que j'aurais produit pour n'importe quel site civique

Relecture faite avant de te soumettre le plan, comme demandé. Trois éléments étaient génériques ; je les ai remplacés.

1. **Premier jet :** un bleu institutionnel et un accent vert au rôle vague (« mise en valeur »). **Remplacé par :**
   - un bleu choisi **contre** les couleurs relevées des cinq partis (section 1.3) ;
   - un accent réservé à un seul sens, propre à cet outil : **ce qui vient de vous**.
2. **Premier jet :** un hero « gros titre, sous-titre, bouton ». **Remplacé par :** la question disséquée, qui ne peut exister que sur ce site.
3. **Premier jet :** une fleur de lys discrète en fond, par réflexe « Québec ». **Remplacé par :** aucun lys par défaut (raison de neutralité en section 3), et une signature visuelle tirée de la méthode : le renvoi de source.

Ce qui reste volontairement « standard », parce que c'est ce qu'on attend d'un site civique accessible : corps 18 px, cibles de 48 px, liens soulignés, contrastes AA.

---

## 8. Décisions de Yanick Huet (13 septembre 2026)

| Point | Décision |
|---|---|
| Ordre des partis | **Aléatoire, stable pendant la visite** (§11 maintenu). Chaque page qui présente les partis l'indique : « Ordre tiré au hasard pour votre visite ». La matrice des positions offre aussi l'ordre alphabétique. Les wireframes de `/partis` suivent cet ordre ; la mention « ordre alphabétique de sigle » est remplacée. |
| Couleurs dans les graphiques | **Couleurs des partis, à l'intérieur des points seulement**, toujours avec le sigle écrit. Méthodologie mise à jour (v1.2). Les couleurs relevées en 1.3 restent à confirmer avant usage. |
| Typographie | **Option 1 : Atkinson Hyperlegible Next**, auto-hébergée |
| Hero | **Idée 1 : la question disséquée** |
| Palette et motif | Palette de la section 1 et renoncement à la fleur de lys : adoptés tels que proposés, sauf avis contraire avant l'étape C |
| Formulations du constat 2 (« nombre égal ») et du constat 3 (« parti arrivé premier ») | Corrigées à l'étape B pour concorder avec la méthodologie |
