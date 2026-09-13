# Médias à obtenir

Étape D, soumise pour validation le 13 septembre 2026.

## Portée
- **Logos : aucun.** Décision de Yanick Huet du 13 septembre 2026 : les partis sont désignés par leur nom et leur sigle, et aucune autorisation n'est demandée.
- **Portraits des cinq chefs : photographies sous licence libre seulement**, tirées de Wikimedia Commons. Les métadonnées ci-dessous ont été relevées le 13 septembre 2026 par l'API de Commons.
- **Règle d'égalité :** si un seul portrait manque ou pose problème, **aucun** portrait n'est affiché ; les cinq partis ont alors un monogramme. Le code l'applique automatiquement (`src/lib/medias.ts`).

## Traitement identique pour les cinq
- Recadrage **4:5, tête et épaules**, yeux à environ 40 % de la hauteur.
- **Fond non modifié :** ni détourage ni retouche, seulement le recadrage et le redimensionnement.
- Deux tailles, **320 × 400 et 640 × 800**, en **AVIF et WebP**, par un script unique appliqué aux cinq.
- La photo source doit mesurer au moins 640 × 800 px **après recadrage**.
- Mention sous chaque photo et sur `/credits` : auteur, licence avec lien, source et modifications (« recadrée et redimensionnée »).

## Ce que les licences exigent
| Licence | Exigences |
|---|---|
| **CC BY 3.0 / 4.0** | Nommer l'auteur, lier la licence, indiquer la source et les modifications. |
| **CC BY-SA 3.0 / 4.0** | Les mêmes exigences, plus le partage à l'identique : les versions recadrées sont diffusées sous la même licence, ce qu'il faut indiquer dans la mention. |
| **CC0** | Aucune obligation juridique, mais le crédit est tout de même affiché, par cohérence. |

---

## Les cinq fichiers recommandés

### 1. Coalition avenir Québec — Christine Fréchette
- **Recommandé :** [File:Christine Fréchette 2024.jpg](https://commons.wikimedia.org/wiki/File:Christine_Fr%C3%A9chette_2024.jpg)
- Licence : **CC BY 3.0**
- Auteur indiqué : **TVA Nouvelles**. C'est une image extraite d'une vidéo, notée « Délais « déraisonnables » pour la réunification familiale ».
- Date : 5 mars 2024
- Taille : 675 × 935 px
- **À vérifier :**
  - la licence CC BY de la vidéo d'origine sur YouTube : la page Commons doit porter une vérification de licence (« License review ») ;
  - la qualité : c'est une image tirée d'une vidéo, probablement moins nette que les autres portraits ;
  - la taille : avec 675 px de largeur, il reste peu de marge pour recadrer à 640 × 800.
- **Écarté :** « Christine Fréchette.jpg » et sa version « (cropped) ». Ils sont marqués CC0, mais l'auteur indiqué est TVA Nouvelles. Les deux informations se contredisent : un média ne verse pas ses images au domaine public sans l'indiquer clairement.

### 2. Parti conservateur du Québec — Éric Duhaime
- **Recommandé :** [File:Éric Duhaime 2022-07-05 (cropped).jpg](https://commons.wikimedia.org/wiki/File:%C3%89ric_Duhaime_2022-07-05_(cropped).jpg)
- Licence : **CC BY-SA 3.0**
- Auteur : **Asclepias** (œuvre personnelle)
- Date : 5 juillet 2022
- Taille : 1044 × 1383 px
- **Écarté :** « Eric Duhaime.jpg », une photo de 2012, trop ancienne.

### 3. Parti libéral du Québec — Charles Milliard
- **Recommandé :** [File:A9306522-Modifier-30 (cropped).jpg](https://commons.wikimedia.org/wiki/File:A9306522-Modifier-30_(cropped).jpg)
- Licence : **CC BY-SA 4.0**
- Auteure : **Amélie Caron** (œuvre personnelle)
- Date : 8 novembre 2024
- Taille : 1249 × 1610 px
- **À vérifier :** que la description de la page Commons identifie bien Charles Milliard. Le nom du fichier ne le mentionne pas ; il a été trouvé par une recherche sur son nom.
- **Solution de rechange :** [File:Charles Milliard Août 2024 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Charles_Milliard_Ao%C3%BBt_2024_(cropped).jpg). Licence CC BY 3.0, TVA Nouvelles, image tirée d'une vidéo, 792 × 1047 px.

### 4. Parti Québécois — Paul St-Pierre Plamondon
- **Recommandé :** [File:Paul St-Pierre Plamondon (crop).jpg](https://commons.wikimedia.org/wiki/File:Paul_St-Pierre_Plamondon_(crop).jpg)
- Licence : **CC BY-SA 4.0**
- Auteur : **Alexis G.**, recadrage de « Paul St-Pierre Plamondon.jpg »
- Date : photo de septembre 2020, recadrée en août 2021
- Taille : 1359 × 1812 px
- **Solution de rechange :** [File:Paul.St-Pierre.Plamondon.cropped.jpg](https://commons.wikimedia.org/wiki/File:Paul.St-Pierre.Plamondon.cropped.jpg). Licence CC BY-SA 4.0, UnPingouin, 2021, 1203 × 1538 px.

### 5. Québec solidaire — Ruba Ghazal
- **Recommandé :** [File:RubaGhazal 2 (3x4).jpg](https://commons.wikimedia.org/wiki/File:RubaGhazal_2_(3x4).jpg)
- Licence : **CC BY-SA 4.0**
- Auteur indiqué : **QuebecSolidaireMercier** (« œuvre personnelle »)
- Date : 9 juillet 2018
- Taille : 1004 × 1338 px
- **À vérifier :** le téléversement vient d'un compte qui semble lié au parti. La licence libre vaut si ce compte détient les droits : c'est à confirmer sur la page Commons.
- **Écart d'âge :** la photo date de 2018, soit six à huit ans de plus que les autres.

---

## Problème de neutralité à trancher
Les cinq meilleures photos libres disponibles **ne sont pas équivalentes** :
- **Âge :** de 2018 (Ruba Ghazal) à 2024 (Christine Fréchette, Charles Milliard).
- **Nature :** photos de photographe pour Charles Milliard, Paul St-Pierre Plamondon et Éric Duhaime ; images tirées d'une vidéo, probablement moins nettes, pour Christine Fréchette.

Des photos de qualité inégale peuvent avantager un chef sur un autre, ce que la règle du « même traitement » veut éviter. Trois options :
1. **Utiliser les cinq photos recommandées** après vérification, en acceptant ces écarts.
2. **N'afficher aucun portrait.** Les monogrammes restent pour les cinq partis ; c'est la solution la plus neutre.
3. **Chercher de meilleures photos libres,** par exemple de nouveaux téléversements sur Commons, ou demander à un photographe une licence libre. C'est plus long.

## Prochaine étape selon ta décision
- **Téléchargement :** si tu retiens l'option 1, je peux télécharger les cinq fichiers depuis Commons, avec ton accord (5 fichiers JPEG de 100 à 800 Ko environ), ou tu me les fournis.
- **Préparation :** je prépare ensuite le script de recadrage et de conversion (AVIF et WebP, deux tailles), identique pour les cinq.
- **Crédits :** je remplis `data/credits.json`, et la page `/credits` se met à jour d'elle-même.
