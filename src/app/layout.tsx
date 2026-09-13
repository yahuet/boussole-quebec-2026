import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { donnees, estDemo } from "@/lib/donnees";
import { formaterDate } from "@/lib/libelles";
import { COURRIEL, DEPOT, IDENTIFICATION_EDITEUR, NOM_SITE, URL_SITE } from "@/lib/site";
import "./globals.css";

// Police auto-hébergée (licence SIL OFL 1.1, voir src/app/polices/LICENCE-OFL.txt) : aucun serveur externe.
const atkinson = localFont({
  src: [
    { path: "./polices/atkinson-hyperlegible-next-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
    { path: "./polices/atkinson-hyperlegible-next-latin-wght-italic.woff2", weight: "200 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-atkinson",
});

const DESCRIPTION =
  "Comparez vos idées aux positions écrites de cinq partis pour l'élection québécoise du 5 octobre 2026, avec la source de chaque position et une explication réponse par réponse. Aucune recommandation de vote, aucune donnée recueillie.";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: { default: `${NOM_SITE} — Québec 2026`, template: `%s — ${NOM_SITE}` },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: NOM_SITE,
    title: `${NOM_SITE} — Québec 2026`,
    description: DESCRIPTION,
    images: [{ url: "/partage.png", width: 1200, height: 630, alt: `${NOM_SITE} : chaque position a sa source` }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1f4e6e" };

const LIENS = [
  { href: "/boussole", texte: "Boussole" },
  { href: "/methodologie", texte: "Méthodologie" },
  { href: "/positions", texte: "Positions" },
  { href: "/partis", texte: "Partis" },
  { href: "/a-propos", texte: "À propos" },
];

const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: NOM_SITE,
  url: URL_SITE,
  inLanguage: "fr-CA",
  description: DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr-CA" className={atkinson.variable}>
      <body className="min-h-dvh flex flex-col bg-fond text-encre">
        <script
          type="application/ld+json"
          // Données structurées minimales, sans aucun contenu fourni par l'utilisateur.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
        />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-3"
        >
          Aller au contenu
        </a>
        {estDemo && (
          <p className="bg-alerte-fond text-alerte text-petit text-center px-4 py-2">
            Données fictives de démonstration : aucun parti réel, aucune position réelle.
          </p>
        )}
        <header className="bg-ancre text-white">
          <div className="mx-auto max-w-[70rem] px-4 py-3 flex items-center gap-4">
            <Link prefetch={false} href="/" className="font-bold text-white no-underline text-h4 mr-auto">
              {NOM_SITE}
            </Link>
            <nav aria-label="Navigation principale" className="hidden md:block">
              <ul className="flex gap-6">
                {LIENS.map((l) => (
                  <li key={l.href}>
                    <Link prefetch={false} href={l.href} className="text-white no-underline hover:underline">
                      {l.texte}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <details className="md:hidden relative">
              <summary className="list-none cursor-pointer select-none px-3 py-2 min-h-12 flex items-center border border-white/60 rounded-[3px]">
                Menu
              </summary>
              <nav
                aria-label="Navigation principale"
                className="absolute right-0 top-full mt-2 w-56 bg-surface border border-trait-fort rounded-[3px] z-40"
              >
                <ul>
                  {LIENS.map((l) => (
                    <li key={l.href} className="border-b border-trait last:border-0">
                      <Link prefetch={false} href={l.href} className="block px-4 py-3 min-h-12 text-ancre">
                        {l.texte}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>
        </header>

        <main id="contenu" className="flex-1 mx-auto w-full max-w-[70rem] px-4 py-8 md:py-12">
          {children}
        </main>

        <footer className="border-t border-trait bg-surface text-petit text-encre-douce">
          <div className="mx-auto max-w-[70rem] px-4 py-8 space-y-3">
            <p>
              Données version {donnees.version}, à jour au {formaterDate(donnees.date_mise_a_jour)}.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {[...LIENS.slice(1), { href: "/credits", texte: "Crédits" }].map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href}>{l.texte}</Link>
                </li>
              ))}
              <li>
                <a href={DEPOT}>Code et données publics</a>
              </li>
              <li>
                <a href={`${DEPOT}/issues`}>Signaler une erreur</a>
              </li>
              <li>
                <a href={`mailto:${COURRIEL}`}>{COURRIEL}</a>
              </li>
            </ul>
            <p>Cet outil ne recommande aucun vote et ne recueille aucune donnée.</p>
            {IDENTIFICATION_EDITEUR && <p>{IDENTIFICATION_EDITEUR}</p>}
          </div>
        </footer>
      </body>
    </html>
  );
}
