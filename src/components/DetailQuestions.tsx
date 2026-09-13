import { estDocumentee, scoreAccord, valeurReponse } from "@/lib/calcul";
import { donnees } from "@/lib/donnees";
import { LIBELLES_POSITION, libelleChoix } from "@/lib/libelles";
import type { Reponses } from "@/lib/types";

/** Détail question par question : votre réponse et la position de chaque parti. */
export default function DetailQuestions({ reponses, ordre }: { reponses: Reponses; ordre: string[] }) {
  return (
    <details className="rounded-[3px] border border-trait bg-surface">
      <summary className="cursor-pointer px-4 py-3 font-semibold">Détail question par question</summary>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full text-petit border-collapse min-w-[40rem]">
          <thead>
            <tr className="text-left border-b border-trait">
              <th className="py-2 pr-3 font-semibold">Question</th>
              <th className="py-2 pr-3 font-semibold">Vous</th>
              {ordre.map((s) => (
                <th key={s} className="py-2 pr-3 font-semibold">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donnees.questions.map((q) => {
              const a = valeurReponse(reponses, q.id);
              return (
                <tr key={q.id} className="border-b border-trait align-top">
                  <td className="py-2 pr-3">{q.enonce}</td>
                  <td className="py-2 pr-3 font-medium text-vous whitespace-nowrap">
                    {libelleChoix(reponses[q.id]?.choix)}
                    {reponses[q.id]?.important && a !== null ? " ×2" : ""}
                  </td>
                  {ordre.map((s) => {
                    const p = q.positions[s];
                    if (!estDocumentee(p)) {
                      return (
                        <td key={s} className="py-2 pr-3 text-encre-douce">
                          Non documentée
                        </td>
                      );
                    }
                    return (
                      <td key={s} className="py-2 pr-3">
                        <a className="underline" href={p.source} target="_blank" rel="noopener noreferrer">
                          {LIBELLES_POSITION[p.valeur]}
                        </a>
                        {a !== null && (
                          <span className="block text-petit text-encre-douce">
                            accord {Math.round(100 * scoreAccord(a, p.valeur))} %
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
