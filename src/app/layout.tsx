import type { Metadata } from "next";
import Link from "next/link";
import { DEPOT } from "@/lib/constantes";
import { donnees, estDemo } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boussole électorale — Québec 2026",
  description:
    "Outil indépendant et sourcé : comparez vos réponses aux plateformes de cinq partis pour l'élection québécoise du 5 octobre 2026. Ce n'est pas une recommandation de vote.",
};

const LIENS = [
  { href: "/", texte: "Accueil" },
  { href: "/questionnaire", texte: "Questionnaire" },
  { href: "/methodologie", texte: "Méthodologie" },
  { href: "/donnees", texte: "D'où viennent les données" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr-CA" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {estDemo && (
          <div className="bg-alerte-fond text-alerte text-sm text-center px-4 py-2 border-b border-amber-200">
            Données fictives de démonstration — aucun parti, aucune position réelle.
          </div>
        )}
        <header className="border-b border-trait bg-surface">
          <nav className="mx-auto max-w-4xl px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/" className="font-semibold text-base mr-auto">
              Boussole électorale <span className="text-encre-douce font-normal">Québec 2026</span>
            </Link>
            {LIENS.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="text-encre-douce hover:text-encre hover:underline">
                {l.texte}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-trait bg-surface text-sm text-encre-douce">
          <div className="mx-auto max-w-4xl px-4 py-6 space-y-2">
            <p>
              Outil indépendant. Il mesure l&apos;écart entre vos réponses et des plateformes écrites ; ce n&apos;est pas une
              recommandation de vote.
            </p>
            <p>
              Aucun compte, aucun cookie de suivi, aucune analytique : vos réponses restent dans votre navigateur.
            </p>
            <p>
              Données version {donnees.version}, à jour au {formaterDate(donnees.date_mise_a_jour)} ·{" "}
              <a className="underline" href={DEPOT}>
                Code et données publics
              </a>{" "}
              ·{" "}
              <a className="underline" href={`${DEPOT}/issues`}>
                Signaler une erreur
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
