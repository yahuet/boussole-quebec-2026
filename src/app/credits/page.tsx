import type { Metadata } from "next";
import { formaterDate } from "@/lib/libelles";
import { lireCredits } from "@/lib/medias";

export const metadata: Metadata = {
  title: "Crédits",
  description: "Sources, auteurs et licences des images et des polices utilisées sur le site.",
};

/** Page générée à partir de data/credits.json. */
export default function Credits() {
  const { images, polices } = lireCredits();
  return (
    <div className="space-y-10 max-w-[66ch]">
      <h1 className="text-h1">Crédits</h1>

      <section className="space-y-3" aria-labelledby="images">
        <h2 id="images" className="text-h2">
          Images
        </h2>
        {images.length === 0 ? (
          <p>
            Aucune photographie n&apos;est publiée pour l&apos;instant. Les portraits des chefs s&apos;afficheront
            seulement si une photo sous licence libre est disponible pour chacun des cinq ; aucun logo de parti
            n&apos;est utilisé.
          </p>
        ) : (
          <ul className="space-y-4">
            {images.map((c) => (
              <li key={c.fichier} className="border-t border-trait pt-3">
                <p className="font-bold">{c.sujet}</p>
                <p>
                  Auteur : {c.auteur} · Licence : <a href={c.licence_url}>{c.licence}</a>
                </p>
                <p>
                  Source : <a href={c.source} className="[overflow-wrap:anywhere]">{c.source}</a>
                </p>
                {c.modifications && <p>Modifications : {c.modifications}</p>}
                <p className="text-petit text-encre-douce">Consultée le {formaterDate(c.consulte_le)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="polices">
        <h2 id="polices" className="text-h2">
          Polices
        </h2>
        <ul className="space-y-4">
          {polices.map((p) => (
            <li key={p.nom} className="border-t border-trait pt-3">
              <p className="font-bold">{p.nom}</p>
              <p>
                Auteur : {p.auteur} · Licence : <a href={p.licence_url}>{p.licence}</a>
              </p>
              <p>
                Source : <a href={p.source} className="[overflow-wrap:anywhere]">{p.source}</a>
              </p>
              <p className="text-petit text-encre-douce">
                Hébergée sur ce site, sans serveur externe · consultée le {formaterDate(p.consulte_le)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
