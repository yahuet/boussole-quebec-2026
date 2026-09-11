import type { ItemQuestion, Section } from "@/lib/explication";
import { LIBELLES_DRAPEAU, formaterDate } from "@/lib/libelles";
import { donnees } from "@/lib/donnees";

export default function SectionTexte({ section }: { section: Section }) {
  return (
    <section className="space-y-3" aria-labelledby={`section-${section.id}`}>
      <h2 id={`section-${section.id}`} className="text-xl font-semibold">
        {section.titre}
      </h2>
      {section.blocs.map((b, i) => {
        switch (b.type) {
          case "paragraphe":
            return (
              <p key={i} className="max-w-3xl">
                {b.texte}
              </p>
            );
          case "sous-titre":
            return (
              <h3 key={i} className="font-semibold pt-2">
                {b.texte}
              </h3>
            );
          case "liste":
            return (
              <ul key={i} className="list-disc pl-6 space-y-1 max-w-3xl">
                {b.items.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            );
          case "questions":
            return (
              <ul key={i} className="space-y-3">
                {b.items.map((it) => (
                  <CarteQuestion key={`${it.questionId}-${it.positions.map((p) => p.sigle).join("")}`} item={it} />
                ))}
              </ul>
            );
        }
      })}
    </section>
  );
}

function CarteQuestion({ item }: { item: ItemQuestion }) {
  return (
    <li className="rounded-lg border border-trait bg-surface p-4 space-y-2">
      <p className="font-medium">{item.enonce}</p>
      <p className="text-sm">
        <span className="text-encre-douce">Votre réponse : </span>
        <span className="font-semibold text-vous">{item.votreReponse}</span>
        {item.important && <span className="ml-2 text-encre-douce">(compte beaucoup pour vous)</span>}
      </p>
      {item.positions.map((p) => {
        const parti = donnees.partis.find((x) => x.sigle === p.sigle);
        const q = donnees.questions.find((x) => x.id === item.questionId);
        const pos = q?.positions[p.sigle];
        const drapeaux = pos && pos.statut === "documentee" ? pos.drapeaux : [];
        return (
          <div key={p.sigle} className="text-sm border-l-2 border-parti-clair pl-3 space-y-1">
            <p>
              <span className="text-encre-douce">Position {parti?.du ?? p.sigle} : </span>
              <span className="font-semibold">{p.libelle}</span>
            </p>
            {p.extrait && <blockquote className="italic text-encre-douce">« {p.extrait} »</blockquote>}
            {p.source && (
              <p>
                <a className="underline break-all" href={p.source} rel="noopener noreferrer" target="_blank">
                  Source
                </a>
                {p.date && <span className="text-encre-douce"> · {formaterDate(p.date)}</span>}
                {drapeaux.map((d) => (
                  <span key={d} className="ml-2 rounded bg-alerte-fond text-alerte px-1.5 py-0.5 text-xs">
                    {LIBELLES_DRAPEAU[d]}
                  </span>
                ))}
              </p>
            )}
          </div>
        );
      })}
    </li>
  );
}
