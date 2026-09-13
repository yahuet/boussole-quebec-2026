# Déploiement sur Vercel et nom de domaine

Étape E, 13 septembre 2026. Ces opérations se font dans ton compte Vercel et chez ton registraire : je ne les fais pas à ta place.

## Vérifications faites avant le déploiement

| Vérification | Résultat |
|---|---|
| Lighthouse (mobile), 7 pages | Performance 97 à 100, accessibilité 100, bonnes pratiques 100, SEO 100 |
| Stabilité de la mise en page (CLS) | 0 sur toutes les pages |
| Erreurs dans la console | aucune (préchargement des liens désactivé, voir plus bas) |
| Contrastes WCAG 2.1 AA | toutes les paires de couleurs passent ; la plus faible : texte gris sur bleu pâle, 4,90:1 |
| Largeur 360 px | aucun débordement horizontal sur les 7 pages, le questionnaire et les résultats (démo) |
| Taille du texte à 360 px | aucun texte sous 14 px |
| Majuscules accentuées | aucune majuscule non accentuée ; toutes les lettres françaises sont dans la police |
| Tests, lint, TypeScript | 27 tests réussis, lint et TypeScript sans erreur |

Corrections faites pendant ces vérifications :
- `/partis` : la liste s'affiche une fois l'ordre aléatoire fixé, pour éviter un saut de mise en page.
- Tous les liens internes : `prefetch={false}`. Next.js 16 demandait, en export statique, des fichiers de préchargement à une adresse qui ne correspond pas aux fichiers produits (erreurs 404 dans la console).
- `/credits` : les longues adresses passent à la ligne sur mobile.
- `/methodologie` : les extraits de code ont au moins 15 px.

Limite connue : trois symboles mathématiques de la méthodologie (Σ, ∈, ≥) ne sont pas dans la police Atkinson ; le navigateur les affiche avec la police du système.

## 1. Relier le dépôt à Vercel

1. Va sur <https://vercel.com/new> et connecte-toi avec ton compte GitHub (`yahuet`).
2. Choisis **Import** à côté du dépôt `boussole-quebec-2026`.
3. Réglages du projet :
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./`
   - **Build Command** et **Output Directory** : laisser les valeurs par défaut
   - **Environment Variables** : aucune. Ne pas définir `NEXT_PUBLIC_DEMO` : sur Vercel, le site refuse de se construire avec les données fictives.
4. Clique sur **Deploy**. Le site est alors en ligne à une adresse du type `boussole-quebec-2026.vercel.app`.

Chaque `git push` sur `main` redéploie ensuite le site automatiquement.

## 2. Réglages à vérifier dans Vercel (confidentialité)

Dans **Settings** du projet :
- **Analytics** (Web Analytics) : **désactivé**.
- **Speed Insights** : **désactivé**.
- **Deployment Protection** : au choix. Les déploiements de prévisualisation peuvent rester protégés ; le domaine de production doit être public.

Le site n'ajoute aucun cookie ni outil de statistiques. Vercel conserve des journaux techniques de serveur (adresse IP, page demandée) : c'est le point « journaux Vercel » de `A-VERIFIER.md`.

## 3. Ajouter le domaine dans Vercel

Dans **Settings → Domains** du projet :
1. Ajoute `boussoleelection.ca`.
2. Ajoute `www.boussoleelection.ca` et choisis **Redirect to `boussoleelection.ca`** (redirection permanente). L'adresse canonique du site, dans le code, est `https://boussoleelection.ca`.

Vercel affiche alors les enregistrements DNS à créer. **Si les valeurs affichées par Vercel diffèrent de celles ci-dessous, utilise celles de Vercel** : elles sont propres à ton projet.

## 4. Enregistrements DNS chez le registraire

À créer dans la zone DNS de `boussoleelection.ca`, chez le registraire où le domaine a été acheté :

| Type | Nom (hôte) | Valeur | TTL |
|---|---|---|---|
| `A` | `@` (ou vide, selon le registraire) | `76.76.21.21` | 3600, ou la valeur par défaut |
| `CNAME` | `www` | `cname.vercel-dns-0.com` | 3600, ou la valeur par défaut |

Source : documentation de Vercel, « Set up a custom domain » (<https://vercel.com/docs/domains/set-up-custom-domain>), consultée le 13 septembre 2026.

Avant de les créer :
- **Supprime** tout autre enregistrement `A` ou `AAAA` sur `@`, et tout enregistrement sur `www`, par exemple une page de stationnement du registraire. Sinon, une partie des visiteurs arrivera ailleurs.
- **Ne touche pas** aux enregistrements `MX` et `TXT` : ils serviront au courriel.
- Si la zone contient un enregistrement `CAA`, ajoute `0 issue "letsencrypt.org"`, sinon Vercel ne pourra pas émettre le certificat HTTPS. S'il n'y a aucun `CAA`, il n'y a rien à faire.

La propagation prend de quelques minutes à quelques heures. Vercel indique **Valid Configuration** et émet le certificat HTTPS automatiquement.

Pour vérifier depuis ton ordinateur :

```bash
nslookup boussoleelection.ca
```

```bash
nslookup www.boussoleelection.ca
```

## 5. Courriel `contact@boussoleelection.ca`

Les enregistrements dépendent du fournisseur choisi (Google Workspace, Microsoft 365, Zoho, redirection offerte par le registraire, etc.). Ils s'ajoutent dans la même zone DNS, sans toucher aux deux enregistrements du site :
- `MX` sur `@`, fournis par le fournisseur de courriel ;
- `TXT` SPF sur `@` (un seul enregistrement SPF par domaine) ;
- `TXT` ou `CNAME` DKIM, et idéalement un `TXT` DMARC sur `_dmarc`.

Dis-moi quel fournisseur tu retiens et je te donnerai les enregistrements exacts, tirés de sa documentation. Tant que la boîte n'existe pas, l'adresse affichée sur le site ne reçoit rien.

## 6. Après la mise en ligne

- Vérifier `https://boussoleelection.ca/robots.txt` et `https://boussoleelection.ca/sitemap.xml`.
- Vérifier que `https://www.boussoleelection.ca` redirige vers `https://boussoleelection.ca`.
- Tester l'aperçu de partage (image `partage.png`) en collant l'adresse dans une messagerie.
- Relancer Lighthouse sur l'adresse publique.
- Le questionnaire reste fermé tant que `data/positions.json` ne contient pas les questions validées : la page d'accueil l'indique.
