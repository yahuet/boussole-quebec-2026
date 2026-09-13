// Texte explicatif de fin (METHODOLOGIE.md, section 10).
// Assemblé de façon déterministe à partir des réponses, des positions et des sources :
// les mêmes réponses et les mêmes données produisent toujours le même texte.

import {
  BASE_REDUITE,
  MIN_REPONSES,
  arrondir,
  calculerProximites,
  calculerSensibilite,
  estDocumentee,
  formerGroupes,
  nombreReponses,
  poids,
  questionsEcart,
  questionsRapprochement,
  questionsSeparation,
  valeurReponse,
  type Changement,
  type Contribution,
  type ResultatParti,
  type Separation,
} from "./calcul";
import { LIBELLES_MOTIF, LIBELLES_POSITION, formaterDate, libelleChoix, pct, pluriel } from "./libelles";
import type { Donnees, Parti, Position, Question, Reponses } from "./types";

export interface PositionAffichee {
  sigle: string;
  libelle: string;
  extrait?: string;
  source?: string;
  date?: string;
}

export interface ItemQuestion {
  questionId: string;
  enonce: string;
  votreReponse: string;
  important: boolean;
  positions: PositionAffichee[];
}

export type Bloc =
  | { type: "paragraphe"; texte: string }
  | { type: "sous-titre"; texte: string }
  | { type: "questions"; items: ItemQuestion[] }
  | { type: "liste"; items: string[] };

export type IdSection =
  | "tete"
  | "rapprochement"
  | "desaccords"
  | "separation"
  | "retirees"
  | "chef"
  | "changements"
  | "rappel";

export interface Section {
  id: IdSection;
  titre: string;
  blocs: Bloc[];
}

export interface Explication {
  suffisant: boolean;
  resultats: ResultatParti[];
  resultatsSansPonderation: ResultatParti[];
  groupes: string[][];
  sections: Section[];
}

export interface ContexteExplication {
  /** Ordre aléatoire stable de la session (§11). */
  ordre: string[];
  /** Sigle du parti dont le chef a été choisi, ou null (« aucun / je ne sais pas »). */
  chef?: string | null;
  /** Changements depuis la dernière visite, et date des données alors utilisées (§13.7). */
  changements?: { depuis: string; liste: Changement[]; scoresAvant: ResultatParti[] };
}

export const rappel = (nbQuestions: number) =>
  `Cet outil mesure l'écart entre vos réponses et les positions écrites de cinq partis sur ${nbQuestions} mesures. ` +
  "Il ne tient pas compte des autres enjeux, du bilan des partis, de leurs équipes ni de vos candidates et candidats locaux. " +
  "Ce n'est pas une recommandation de vote.";

function partiDe(donnees: Donnees, sigle: string): Parti {
  const p = donnees.partis.find((x) => x.sigle === sigle);
  if (!p) throw new Error(`Parti inconnu : ${sigle}`);
  return p;
}

/** Réordonne des sigles selon l'ordre de session (jamais par score à l'intérieur d'un groupe, §6.3). */
function selonOrdre(sigles: string[], ordre: string[]): string[] {
  return [...sigles].sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));
}

/** « A », « A et B », « A, B et C ». */
function enumerer(elements: string[]): string {
  if (elements.length <= 1) return elements.join("");
  return `${elements.slice(0, -1).join(", ")} et ${elements[elements.length - 1]}`;
}

function positionAffichee(sigle: string, p: Position | undefined): PositionAffichee {
  if (!estDocumentee(p)) {
    return { sigle, libelle: `Position non documentée${p ? ` (${LIBELLES_MOTIF[p.motif]})` : ""}` };
  }
  return { sigle, libelle: LIBELLES_POSITION[p.valeur], extrait: p.extrait, source: p.source, date: p.date };
}

function item(q: Question, reponses: Reponses, sigles: string[]): ItemQuestion {
  return {
    questionId: q.id,
    enonce: q.enonce,
    votreReponse: libelleChoix(reponses[q.id]?.choix),
    important: poids(reponses, q.id) === 2,
    positions: sigles.map((s) => positionAffichee(s, q.positions[s])),
  };
}

function scoreDe(resultats: ResultatParti[], sigle: string): ResultatParti {
  return resultats.find((r) => r.sigle === sigle) as ResultatParti;
}

/** « de la CAQ (72 %, 27 questions) » — forme avec « de » déjà contractée (« du PQ »). */
function descriptionScore(donnees: Donnees, r: ResultatParti): string {
  return `${partiDe(donnees, r.sigle).du} (${pct(r.arrondi as number)}, ${pluriel(r.n, "question")})`;
}

// --- Sections ---

function sectionTete(donnees: Donnees, reponses: Reponses, resultats: ResultatParti[], tete: string[]): Section {
  const blocs: Bloc[] = [];
  const n = nombreReponses(donnees, reponses);
  if (tete.length === 1) {
    const r = scoreDe(resultats, tete[0]);
    const parti = partiDe(donnees, tete[0]);
    blocs.push({
      type: "paragraphe",
      texte: `Vos réponses sont les plus proches de la plateforme ${parti.du} : ${pct(r.arrondi as number)} de proximité, calculée sur ${pluriel(r.n, "question")}.`,
    });
  } else {
    const descriptions = tete.map((s) => descriptionScore(donnees, scoreDe(resultats, s)));
    blocs.push({
      type: "paragraphe",
      texte:
        `Vos réponses sont à égale proximité ${enumerer(descriptions)}. ` +
        "L'écart entre ces partis est de moins de 5 points : l'outil ne les départage pas.",
    });
  }
  const nonAffiches = resultats.filter((r) => !r.affiche);
  if (nonAffiches.length > 0) {
    blocs.push({
      type: "paragraphe",
      texte: `Aucun score n'est affiché pour ${enumerer(nonAffiches.map((r) => partiDe(donnees, r.sigle).le))} : moins de 10 questions comparables.`,
    });
  }
  if (n < BASE_REDUITE) {
    blocs.push({
      type: "paragraphe",
      texte: `Vous avez répondu à ${n} questions sur ${donnees.questions.length}. Les résultats reposent sur une base réduite.`,
    });
  }
  blocs.push({
    type: "paragraphe",
    texte:
      "Une proximité de 100 % voudrait dire une réponse identique à la position du parti sur chaque question. " +
      "Les écarts entre partis sont plus informatifs que les valeurs elles-mêmes.",
  });
  return { id: "tete", titre: "Les plateformes les plus proches de vos réponses", blocs };
}

function sectionRapprochement(donnees: Donnees, reponses: Reponses, tete: string[]): Section {
  const blocs: Bloc[] = [];
  const max = tete.length === 1 ? 5 : 3;
  for (const sigle of tete) {
    const parti = partiDe(donnees, sigle);
    const items = questionsRapprochement(donnees, reponses, sigle).slice(0, max);
    if (tete.length > 1) blocs.push({ type: "sous-titre", texte: parti.nom });
    if (items.length === 0) {
      blocs.push({
        type: "paragraphe",
        texte: `Aucune de vos réponses ne vous rapproche nettement plus ${parti.du} que des autres partis.`,
      });
      continue;
    }
    blocs.push({
      type: "paragraphe",
      texte:
        items.length < 3
          ? `Seulement ${pluriel(items.length, "réponse")} vous ${items.length > 1 ? "rapprochent" : "rapproche"} nettement plus ${parti.du} que des autres partis :`
          : `Les réponses qui vous rapprochent le plus ${parti.du}, par rapport aux autres partis :`,
    });
    blocs.push({ type: "questions", items: items.map((c) => item(c.question, reponses, [sigle])) });
  }
  return { id: "rapprochement", titre: "Ce qui vous rapproche", blocs };
}

function sectionDesaccords(donnees: Donnees, reponses: Reponses, resultats: ResultatParti[], tete: string[]): Section {
  const blocs: Bloc[] = [];
  for (const sigle of tete) {
    const parti = partiDe(donnees, sigle);
    const r = scoreDe(resultats, sigle);
    if (tete.length > 1) blocs.push({ type: "sous-titre", texte: parti.nom });
    const desaccords = questionsEcart(donnees, reponses, sigle, 2);
    if (desaccords.length > 0) {
      const affiches = desaccords.slice(0, 5);
      blocs.push({
        type: "paragraphe",
        texte:
          `Sur ${desaccords.length} des ${pluriel(r.n, "question")} comptabilisées, votre réponse est à au moins deux crans de la position ${parti.du}.` +
          (desaccords.length > 5
            ? ` Voici les 5 écarts les plus marqués ; les ${desaccords.length - 5} autres figurent dans le détail question par question.`
            : ""),
      });
      blocs.push({ type: "questions", items: affiches.map((c) => item(c.question, reponses, [sigle])) });
      continue;
    }
    const nuances = questionsEcart(donnees, reponses, sigle, 1);
    if (nuances.length > 0) {
      blocs.push({
        type: "paragraphe",
        texte: `Aucune de vos réponses n'est à deux crans ou plus de la position ${parti.du}. Vous en différez d'un cran sur ${pluriel(nuances.length, "question")} :`,
      });
      blocs.push({ type: "questions", items: nuances.slice(0, 5).map((c) => item(c.question, reponses, [sigle])) });
      continue;
    }
    const nonVerifiees = donnees.questions.filter(
      (q) => valeurReponse(reponses, q.id) === null || !estDocumentee(q.positions[sigle]),
    );
    blocs.push({
      type: "paragraphe",
      texte:
        `Vos réponses correspondent à la position ${parti.du} sur les ${pluriel(r.n, "question")} comptabilisées.` +
        (nonVerifiees.length > 0
          ? ` L'accord n'a pas pu être vérifié sur ${pluriel(nonVerifiees.length, "autre question", "autres questions")}, laissées sans opinion ou sans position documentée :`
          : ""),
    });
    if (nonVerifiees.length > 0) {
      blocs.push({ type: "questions", items: nonVerifiees.map((q) => item(q, reponses, [sigle])) });
    }
  }
  return { id: "desaccords", titre: "Vos désaccords avec les partis les plus proches", blocs };
}

function paires(tete: string[], groupes: string[][], ordre: string[]): [string, string][] {
  if (tete.length >= 2) {
    const t = selonOrdre(tete, ordre);
    const toutes: [string, string][] = [];
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) toutes.push([t[i], t[j]]);
    return toutes.slice(0, 3);
  }
  const suivant = groupes[1] ? selonOrdre(groupes[1], ordre).slice(0, 2) : [];
  return suivant.map((s) => [tete[0], s] as [string, string]);
}

function itemsSeparation(liste: Separation[], reponses: Reponses, a: string, b: string): ItemQuestion[] {
  return liste.map((s) => item(s.question, reponses, [a, b]));
}

function sectionSeparation(
  donnees: Donnees,
  reponses: Reponses,
  tete: string[],
  groupes: string[][],
  ordre: string[],
): Section | null {
  const liste = paires(tete, groupes, ordre);
  if (liste.length === 0) return null;
  const blocs: Bloc[] = [];
  for (const [a, b] of liste) {
    const pa = partiDe(donnees, a);
    const pb = partiDe(donnees, b);
    const { versA, versB } = questionsSeparation(donnees, reponses, a, b);
    let gardeA = versA.slice(0, 3);
    let gardeB = versB.slice(0, 3);
    while (gardeA.length + gardeB.length > 5) {
      if (gardeA.length >= gardeB.length) gardeA = gardeA.slice(0, -1);
      else gardeB = gardeB.slice(0, -1);
    }
    blocs.push({ type: "sous-titre", texte: `${pa.nom} et ${pb.nom}` });
    if (gardeA.length === 0 && gardeB.length === 0) {
      blocs.push({
        type: "paragraphe",
        texte: `Aucune de vos réponses ne vous place nettement plus près ${pa.du} que ${pb.du}, ni l'inverse.`,
      });
      continue;
    }
    if (gardeA.length > 0) {
      blocs.push({ type: "paragraphe", texte: `Vos réponses nettement plus proches de la position ${pa.du} que de celle ${pb.du} :` });
      blocs.push({ type: "questions", items: itemsSeparation(gardeA, reponses, a, b) });
    }
    if (gardeB.length > 0) {
      blocs.push({ type: "paragraphe", texte: `Vos réponses nettement plus proches de la position ${pb.du} que de celle ${pa.du} :` });
      blocs.push({ type: "questions", items: itemsSeparation(gardeB, reponses, a, b) });
    }
  }
  const titre =
    tete.length >= 2 ? "Ce qui distingue les partis les plus proches entre eux" : "Ce qui vous sépare du parti suivant";
  return { id: "separation", titre, blocs };
}

function phraseSensibilite(donnees: Donnees, reponses: Reponses, a: string, b: string): string | null {
  const s = calculerSensibilite(donnees, reponses, a, b);
  if (!s) return null;
  const pa = partiDe(donnees, a);
  const pb = partiDe(donnees, b);
  const min = arrondir(s.min);
  const max = arrondir(s.max);
  const borne = (v: number) =>
    v === 0 ? "un écart nul" : v > 0 ? `${pluriel(v, "point")} en faveur ${pa.du}` : `${pluriel(-v, "point")} en faveur ${pb.du}`;
  return `Selon les réponses que vous auriez pu donner à ces questions, l'écart entre ${pa.le} et ${pb.le} aurait pu aller de ${borne(min)} à ${borne(max)}.`;
}

function sectionRetirees(
  donnees: Donnees,
  reponses: Reponses,
  resultats: ResultatParti[],
  sansPonderation: ResultatParti[],
  groupes: string[][],
  groupesSansPonderation: string[][],
  tete: string[],
  ordre: string[],
): Section {
  const blocs: Bloc[] = [];

  // Sans opinion (§8)
  const sansOpinion = donnees.questions.filter((q) => valeurReponse(reponses, q.id) === null);
  blocs.push({ type: "sous-titre", texte: "Questions laissées sans opinion" });
  if (sansOpinion.length === 0) {
    blocs.push({ type: "paragraphe", texte: "Vous avez donné une réponse à toutes les questions." });
  } else {
    blocs.push({
      type: "paragraphe",
      texte: `Vous n'avez pas donné d'opinion sur ${pluriel(sansOpinion.length, "question")}. Elles ont été retirées du calcul pour tous les partis : elles ne comptent ni pour ni contre aucun parti.`,
    });
    blocs.push({ type: "liste", items: sansOpinion.map((q) => q.enonce) });
    const [a, b] = paires(tete, groupes, ordre)[0] ?? [];
    if (a && b) {
      const opposees = sansOpinion.filter((q) => {
        const pa = q.positions[a];
        const pb = q.positions[b];
        return estDocumentee(pa) && estDocumentee(pb) && Math.abs(pa.valeur - pb.valeur) >= 2;
      });
      if (opposees.length > 0) {
        blocs.push({
          type: "paragraphe",
          texte: `Sur ${pluriel(opposees.length, "de ces questions", "de ces questions")}, ${partiDe(donnees, a).le} et ${partiDe(donnees, b).le} ont des positions éloignées d'au moins deux crans.`,
        });
      }
      const phrase = phraseSensibilite(donnees, reponses, a, b);
      if (phrase) blocs.push({ type: "paragraphe", texte: phrase });
    }
  }

  // Positions non documentées (§5.3)
  blocs.push({ type: "sous-titre", texte: "Positions non documentées" });
  const lignes: string[] = [];
  for (const sigle of ordre) {
    const r = scoreDe(resultats, sigle);
    if (!r || r.exclusNonDocumentees.length === 0) continue;
    const parti = partiDe(donnees, sigle);
    const details = r.exclusNonDocumentees.map((id) => {
      const q = donnees.questions.find((x) => x.id === id) as Question;
      const p = q.positions[sigle];
      const motif = p && !estDocumentee(p) ? LIBELLES_MOTIF[p.motif] : "aucune source trouvée";
      return `« ${q.enonce} » (${motif})`;
    });
    lignes.push(
      `${parti.nom} : ${pluriel(details.length, "question retirée", "questions retirées")} de son calcul. ${details.join(" ; ")}.`,
    );
  }
  blocs.push(
    lignes.length === 0
      ? { type: "paragraphe", texte: "Tous les partis ont une position documentée sur les questions auxquelles vous avez répondu." }
      : { type: "liste", items: lignes },
  );

  // Effet de l'importance (§6.4)
  const importantes = donnees.questions.filter((q) => poids(reponses, q.id) === 2);
  blocs.push({ type: "sous-titre", texte: "Effet de l'option « compte beaucoup pour moi »" });
  if (importantes.length === 0) {
    blocs.push({ type: "paragraphe", texte: "Vous n'avez marqué aucune question comme importante : toutes ont le même poids." });
  } else {
    blocs.push({
      type: "paragraphe",
      texte: `Vous avez indiqué que ${pluriel(importantes.length, "question compte", "questions comptent")} beaucoup pour vous : leur poids a été doublé.`,
    });
    blocs.push({ type: "liste", items: importantes.map((q) => q.enonce) });
    const comparaisons = ordre
      .map((s) => ({ avec: scoreDe(resultats, s), sans: scoreDe(sansPonderation, s) }))
      .filter((x) => x.avec?.affiche && x.sans?.affiche)
      .map(({ avec, sans }) => {
        const d = (avec.arrondi as number) - (sans.arrondi as number);
        const ecart = d === 0 ? "sans changement" : `${d > 0 ? "+" : "−"}${pluriel(Math.abs(d), "point")}`;
        return `${partiDe(donnees, avec.sigle).nom} : ${pct(avec.arrondi as number)} avec la pondération, ${pct(sans.arrondi as number)} sans (${ecart})`;
      });
    blocs.push({ type: "liste", items: comparaisons });
    const teteSans = groupesSansPonderation[0] ?? [];
    const meme = teteSans.length === tete.length && teteSans.every((s) => tete.includes(s));
    blocs.push({
      type: "paragraphe",
      texte: meme
        ? "Sans cette pondération, le groupe des partis les plus proches serait le même."
        : `Sans cette pondération, le groupe des partis les plus proches serait composé ${enumerer(selonOrdre(teteSans, ordre).map((s) => partiDe(donnees, s).du))}.`,
    });
  }

  blocs.push({
    type: "paragraphe",
    texte: `Calcul effectué avec les données version ${donnees.version}, à jour au ${formaterDate(donnees.date_mise_a_jour)}.`,
  });
  return { id: "retirees", titre: "Ce qui a été retiré ou pondéré dans le calcul", blocs };
}

function sectionChef(donnees: Donnees, resultats: ResultatParti[], tete: string[], chef: string | null | undefined): Section | null {
  if (!chef) return null;
  const parti = partiDe(donnees, chef);
  const r = scoreDe(resultats, chef);
  const blocs: Bloc[] = [];
  const proximite = r.affiche ? ` (${pct(r.arrondi as number)})` : "";
  if (tete.includes(chef)) {
    blocs.push({
      type: "paragraphe",
      texte: `Vous avez choisi ${parti.chef.nom}, ${parti.du}. Ce parti fait partie du groupe de partis les plus proches de vos réponses${proximite}.`,
    });
  } else {
    blocs.push({
      type: "paragraphe",
      texte:
        `Vous avez choisi ${parti.chef.nom}, ${parti.du}. ` +
        (r.affiche ? `La proximité entre vos réponses et la plateforme de ce parti est de ${pct(r.arrondi as number)}. ` : "") +
        `Les partis les plus proches de vos réponses sont ${enumerer(tete.map((s) => partiDe(donnees, s).le))}.`,
    });
  }
  blocs.push({
    type: "paragraphe",
    texte: "Cette question n'entre pas dans le calcul de proximité.",
  });
  return { id: "chef", titre: "Votre choix de chef", blocs };
}

function sectionChangements(donnees: Donnees, resultats: ResultatParti[], contexte: ContexteExplication): Section | null {
  const c = contexte.changements;
  if (!c || c.liste.length === 0) return null;
  const blocs: Bloc[] = [
    {
      type: "paragraphe",
      texte: `Depuis votre dernière visite (données au ${formaterDate(c.depuis)}), ${pluriel(c.liste.length, "position a changé", "positions ont changé")} sur des questions auxquelles vous avez répondu. Vos résultats ont été recalculés avec les données à jour au ${formaterDate(donnees.date_mise_a_jour)}.`,
    },
    {
      type: "liste",
      items: c.liste.map((ch) => {
        const parti = partiDe(donnees, ch.sigle);
        const avant = ch.avant === null ? "non documentée" : LIBELLES_POSITION[ch.avant].toLowerCase();
        const apres = ch.apres === null ? "non documentée" : LIBELLES_POSITION[ch.apres].toLowerCase();
        return `${parti.nom} — « ${ch.question.enonce} » : ${avant} → ${apres}.`;
      }),
    },
  ];
  const scores = contexte.ordre
    .map((s) => ({ avant: scoreDe(c.scoresAvant, s), apres: scoreDe(resultats, s) }))
    .filter((x) => x.avant?.affiche && x.apres?.affiche && x.avant.arrondi !== x.apres.arrondi)
    .map(({ avant, apres }) => `${partiDe(donnees, apres.sigle).nom} : ${pct(avant.arrondi as number)} → ${pct(apres.arrondi as number)}`);
  if (scores.length > 0) blocs.push({ type: "liste", items: scores });
  return { id: "changements", titre: "Depuis votre dernière visite", blocs };
}

export function genererExplication(donnees: Donnees, reponses: Reponses, contexte: ContexteExplication): Explication {
  const resultats = calculerProximites(donnees, reponses);
  const resultatsSansPonderation = calculerProximites(donnees, reponses, { ponderation: false });
  const groupes = formerGroupes(resultats);
  const n = nombreReponses(donnees, reponses);

  if (n < MIN_REPONSES || groupes.length === 0) {
    return {
      suffisant: false,
      resultats,
      resultatsSansPonderation,
      groupes,
      sections: [
        {
          id: "tete",
          titre: "Pas assez de réponses pour calculer une proximité",
          blocs: [
            {
              type: "paragraphe",
              texte: `Vous avez répondu à ${pluriel(n, "question")}. Il en faut au moins ${MIN_REPONSES} pour qu'une proximité ait un sens.`,
            },
          ],
        },
        { id: "rappel", titre: "À retenir", blocs: [{ type: "paragraphe", texte: rappel(donnees.questions.length) }] },
      ],
    };
  }

  const tete = selonOrdre(groupes[0], contexte.ordre);
  const groupesSansPonderation = formerGroupes(resultatsSansPonderation);
  const sections: Section[] = [
    sectionTete(donnees, reponses, resultats, tete),
    sectionRapprochement(donnees, reponses, tete),
    sectionDesaccords(donnees, reponses, resultats, tete),
  ];
  const separation = sectionSeparation(donnees, reponses, tete, groupes, contexte.ordre);
  if (separation) sections.push(separation);
  sections.push(
    sectionRetirees(donnees, reponses, resultats, resultatsSansPonderation, groupes, groupesSansPonderation, tete, contexte.ordre),
  );
  const chef = sectionChef(donnees, resultats, tete, contexte.chef);
  if (chef) sections.push(chef);
  const changements = sectionChangements(donnees, resultats, contexte);
  if (changements) sections.push(changements);
  sections.push({ id: "rappel", titre: "À retenir", blocs: [{ type: "paragraphe", texte: rappel(donnees.questions.length) }] });

  return { suffisant: true, resultats, resultatsSansPonderation, groupes, sections };
}

/** Tout le texte d'une explication, pour l'audit des formulations interdites (A7). */
export function texteIntegral(explication: Explication): string {
  const morceaux: string[] = [];
  for (const s of explication.sections) {
    morceaux.push(s.titre);
    for (const b of s.blocs) {
      if (b.type === "paragraphe" || b.type === "sous-titre") morceaux.push(b.texte);
      else if (b.type === "liste") morceaux.push(...b.items);
      else for (const i of b.items) morceaux.push(i.votreReponse, ...i.positions.map((p) => p.libelle));
    }
  }
  return morceaux.join("\n");
}

export type { Contribution };
