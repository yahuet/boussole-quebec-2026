import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import ListePartis from "@/components/ListePartis";
import Portrait from "@/components/Portrait";
import { donnees } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";
import { portraitsDisponibles } from "@/lib/medias";

export const metadata: Metadata = {
  title: "Les cinq partis",
  description: "Les cinq partis couverts, présentés avec le même gabarit et un résumé factuel de 50 mots, chaque fait lié à sa source.",
};

interface FichesPartis {
  mots_par_resume: number;
  a_jour_au: string;
  resumes: Record<string, { texte: string; source: string }[]>;
  fiches: Record<string, { titre_chef: string; site_officiel: string }>;
}

export default function Partis() {
  const infos = JSON.parse(readFileSync(join(process.cwd(), "data", "partis.json"), "utf8")) as FichesPartis;
  const portraits = portraitsDisponibles(donnees.partis.map((p) => p.sigle));

  const fiches = donnees.partis.map((parti) => {
    const fiche = infos.fiches[parti.sigle];
    const resume = infos.resumes[parti.sigle] ?? [];
    return {
      sigle: parti.sigle,
      contenu: (
        <>
          <h2 id={`parti-${parti.sigle}`} className="text-h3 self-end">
            {parti.nom} <span className="text-encre-douce font-normal">({parti.sigle})</span>
          </h2>
          <Portrait
            nom={parti.chef.nom}
            role={`${fiche?.titre_chef ?? "chef"}, ${parti.nom}`}
            credit={portraits?.[parti.sigle] ?? null}
          />
          <p className="max-w-[66ch]">
            {resume.map((phrase, i) => (
              <span key={i}>
                {phrase.texte}{" "}
                <a className="renvoi" href={phrase.source} rel="noopener noreferrer">
                  source
                </a>{" "}
              </span>
            ))}
          </p>
          <ul className="space-y-1 text-petit self-end">
            <li>
              <a href={fiche?.site_officiel} rel="noopener noreferrer">
                Site officiel
              </a>
            </li>
            <li>
              <Link href="/positions">Positions dans la matrice</Link>
            </li>
          </ul>
        </>
      ),
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-h1">Les cinq partis</h1>
      <div className="max-w-[66ch] space-y-3">
        <p>
          Les partis sont présentés dans un ordre tiré au hasard pour votre visite. Chaque fiche a le même gabarit et un
          résumé d&apos;exactement {infos.mots_par_resume} mots ; chaque fait renvoie à sa source.
        </p>
        <p className="text-petit text-encre-douce">
          Résumés à jour au {formaterDate(infos.a_jour_au)}. Pourquoi ces cinq partis : ce sont ceux qui ont obtenu au
          moins 5 % des votes valides en 2022 (<Link href="/methodologie">méthodologie, section 1</Link>). Aucun logo
          n&apos;est affiché, pour aucun parti.
          {!portraits && " Les portraits s'afficheront seulement lorsqu'une photo sous licence libre sera disponible pour chacun des cinq chefs ; d'ici là, des initiales les remplacent pour tous."}
        </p>
      </div>
      <ListePartis fiches={fiches} />
    </div>
  );
}
