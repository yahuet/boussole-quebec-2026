import type { CreditImage } from "@/lib/medias";

/** Initiales pour le monogramme : « Christine Fréchette » → « CF ». */
function initiales(nom: string): string {
  return nom
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((m) => m[0])
    .filter((c) => c === c.toUpperCase())
    .slice(0, 3)
    .join("");
}

/**
 * Portrait d'un chef au format 4:5, ou monogramme neutre aux mêmes dimensions.
 * Aucune image brisée possible : sans crédit, le composant n'essaie même pas de charger un fichier.
 * Les fichiers sont préparés d'avance en AVIF et WebP, en deux tailles (scripts/preparer-portraits.ts) ;
 * l'export statique de Next.js ne permet pas l'optimisation d'images à la volée.
 */
export default function Portrait({
  nom,
  role,
  credit,
}: {
  nom: string;
  /** Pour le texte de remplacement : « cheffe de la Coalition avenir Québec ». */
  role: string;
  credit?: CreditImage | null;
}) {
  const cadre = "w-40 aspect-[4/5] shrink-0 bg-ancre-pale border border-trait overflow-hidden";

  if (!credit) {
    return (
      <div className={`${cadre} flex items-center justify-center`} aria-hidden="true">
        <span className="text-h2 font-bold text-encre-douce tracking-normal">{initiales(nom)}</span>
      </div>
    );
  }

  const base = `/medias/${credit.fichier}`;
  return (
    <figure className="w-40 shrink-0">
      <picture>
        <source type="image/avif" srcSet={`${base}-320.avif 320w, ${base}-640.avif 640w`} sizes="160px" />
        <source type="image/webp" srcSet={`${base}-320.webp 320w, ${base}-640.webp 640w`} sizes="160px" />
        <img
          src={`${base}-320.webp`}
          width={320}
          height={400}
          loading="lazy"
          decoding="async"
          alt={`Portrait de ${nom}, ${role}`}
          className={`${cadre} block w-40 h-auto object-cover`}
        />
      </picture>
      <figcaption className="mt-1 text-petit text-encre-douce">
        Photo : {credit.auteur}, <a href={credit.licence_url}>{credit.licence}</a>
      </figcaption>
    </figure>
  );
}
