import { describe, expect, it } from "vitest";
import {
  arrondir,
  calculerCoordonnees,
  calculerProximites,
  calculerSensibilite,
  changementsDepuis,
  formerGroupes,
  scoreAccord,
  type ResultatParti,
} from "../src/lib/calcul";
import type { Reponses, Valeur } from "../src/lib/types";
import { donnees, position, question } from "./fixtures";

describe("score d'accord (§6.1)", () => {
  it("vaut 1 pour une réponse identique et 0 pour l'extrême opposé", () => {
    expect(scoreAccord(2, 2)).toBe(1);
    expect(scoreAccord(2, -2)).toBe(0);
    expect(scoreAccord(0, 2)).toBe(0.5);
    expect(scoreAccord(-1, 1)).toBe(0.5);
  });

  it("arrondit ,5 vers le haut", () => {
    expect(arrondir(62.5)).toBe(63);
    expect(arrondir(62.49)).toBe(62);
  });
});

describe("exemple chiffré de la méthodologie (§6.2)", () => {
  const d = donnees(
    [
      question("q1", [2, -1]),
      question("q2", [1, null]),
      question("q3", [-2, 0]),
      question("q4", [2, -2]),
    ],
    2,
  );
  const reponses: Reponses = {
    q1: { choix: 2, important: true },
    q2: { choix: -1, important: false },
    q3: { choix: 0, important: false },
    q4: { choix: "sans_opinion", important: false },
  };

  it("donne 75 % à A sur 3 questions et 50 % à B sur 2 questions", () => {
    const [a, b] = calculerProximites(d, reponses);
    expect(a.score).toBeCloseTo(75);
    expect(a.n).toBe(3);
    expect(b.score).toBeCloseTo(50);
    expect(b.n).toBe(2);
    expect(b.exclusNonDocumentees).toEqual(["q2"]);
  });

  it("donne 67 % et 63 % sans pondération", () => {
    const [a, b] = calculerProximites(d, reponses, { ponderation: false });
    expect(arrondir(a.score as number)).toBe(67);
    expect(arrondir(b.score as number)).toBe(63);
  });

  it("n'affiche pas de score sous 10 questions comparables (§6.5)", () => {
    const [a] = calculerProximites(d, reponses);
    expect(a.affiche).toBe(false);
    expect(a.arrondi).toBeNull();
  });
});

describe("groupes d'équivalence (§6.3)", () => {
  const r = (sigle: string, arrondi: number): ResultatParti => ({
    sigle,
    score: arrondi,
    arrondi,
    n: 20,
    affiche: true,
    exclusNonDocumentees: [],
  });

  it("n'enchaîne pas : 70, 66, 62 donnent {A, B} puis {C}", () => {
    expect(formerGroupes([r("A", 70), r("B", 66), r("C", 62)])).toEqual([["A", "B"], ["C"]]);
  });

  it("sépare deux partis à exactement 5 points", () => {
    expect(formerGroupes([r("A", 70), r("B", 65)])).toEqual([["A"], ["B"]]);
  });
});

describe("coordonnées d'axe (§7)", () => {
  it("applique le sens et exige la moitié des questions de l'axe", () => {
    const d = donnees([
      question("c1", [2, -2], "constitutionnel", 1),
      question("c2", [-2, 2], "constitutionnel", -1),
      question("c3", [2, null], "constitutionnel", 1),
    ], 2);
    const reponses: Reponses = { c1: { choix: 2, important: true }, c2: { choix: -2, important: false } };
    const { vous, partis } = calculerCoordonnees(d, reponses);
    expect(vous.constitutionnel).toBe(1);
    expect(partis.PA.constitutionnel).toBe(1);
    expect(partis.PB.constitutionnel).toBe(-1);
    expect(vous.economique).toBeNull();
  });
});

describe("sensibilité aux questions sans opinion (§8)", () => {
  it("encadre l'écart symétriquement quand les positions sont opposées", () => {
    const qs = Array.from({ length: 12 }, (_, i) => question(`q${i}`, [2, -2]));
    const d = donnees(qs, 2);
    const reponses: Reponses = Object.fromEntries(
      qs.slice(0, 10).map((q) => [q.id, { choix: 0 as Valeur, important: false }]),
    );
    const s = calculerSensibilite(d, reponses, "PA", "PB");
    expect(s?.questions).toEqual(["q10", "q11"]);
    // Les deux réponses à +2 : A = (10×0,5 + 2)/12, B = (10×0,5 + 0)/12, écart = 16,67 points.
    expect(s?.max).toBeCloseTo((100 * 2) / 12);
    expect(s?.min).toBeCloseTo(-(100 * 2) / 12);
  });

  it("donne le même résultat qu'une énumération complète", () => {
    const qs = [
      ...Array.from({ length: 10 }, (_, i) => question(`r${i}`, [1, -1, 2])),
      question("s1", [2, null, -1]),
      question("s2", [-1, 2, 0]),
      question("s3", [null, 1, 2]),
    ];
    const d = donnees(qs, 3);
    const reponses: Reponses = Object.fromEntries(
      qs.slice(0, 10).map((q, i) => [q.id, { choix: ([-2, -1, 0, 1, 2] as Valeur[])[i % 5], important: i % 3 === 0 }]),
    );
    const s = calculerSensibilite(d, reponses, "PA", "PB");
    let min = Infinity;
    let max = -Infinity;
    const vals: Valeur[] = [-2, -1, 0, 1, 2];
    for (const v1 of vals) for (const v2 of vals) for (const v3 of vals) {
      const r: Reponses = { ...reponses, s1: { choix: v1, important: false }, s2: { choix: v2, important: false }, s3: { choix: v3, important: false } };
      const [a, b] = calculerProximites(d, r);
      const e = (a.score as number) - (b.score as number);
      min = Math.min(min, e);
      max = Math.max(max, e);
    }
    expect(s?.min).toBeCloseTo(min);
    expect(s?.max).toBeCloseTo(max);
  });
});

describe("historique des positions (§13.7)", () => {
  it("retrouve les positions modifiées depuis une date", () => {
    const q = question("q1", [2, -2]);
    q.positions.PA = {
      ...position(1),
      historique: [{ valeur: -1, statut: "documentee", remplacee_le: "2026-09-20T10:00", motif: "nouvel engagement" }],
    } as typeof q.positions.PA;
    const d = donnees([q], 2);
    const reponses: Reponses = { q1: { choix: 2, important: false } };
    const ch = changementsDepuis(d, reponses, "2026-09-15T00:00");
    expect(ch).toHaveLength(1);
    expect(ch[0]).toMatchObject({ sigle: "PA", avant: -1, apres: 1 });
    expect(changementsDepuis(d, reponses, "2026-09-21T00:00")).toHaveLength(0);
  });
});
