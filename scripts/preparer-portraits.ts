// Prépare les portraits des chefs : même recadrage 4:5 pour les cinq, deux tailles, AVIF et WebP.
//
//   npx tsx scripts/preparer-portraits.ts
//
// Entrée : les photos originales sous licence libre (medias-sources/, non publié dans le dépôt)
// et les repères de visage de scripts/portraits.json.
// Sortie : public/medias/portraits/<SIGLE>-320.avif|webp et -640.avif|webp.

import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

interface Reperes {
  source: string;
  yeux_y: number;
  menton_y: number;
  centre_x: number;
}

const config = JSON.parse(readFileSync("scripts/portraits.json", "utf8")) as {
  facteur_hauteur: number;
  position_yeux: number;
  portraits: Record<string, Reperes>;
};

async function preparer() {
  mkdirSync("public/medias/portraits", { recursive: true });

  for (const [sigle, r] of Object.entries(config.portraits)) {
  const image = sharp(r.source).rotate();
  const { width = 0, height = 0 } = await image.metadata();
  const hauteur = Math.min(Math.round(config.facteur_hauteur * (r.menton_y - r.yeux_y)), height, Math.floor(width / 0.8));
  const largeur = Math.round(hauteur * 0.8);
  const haut = Math.max(0, Math.min(Math.round(r.yeux_y - config.position_yeux * hauteur), height - hauteur));
  const gauche = Math.max(0, Math.min(Math.round(r.centre_x - largeur / 2), width - largeur));
  const recadre = image.extract({ left: gauche, top: haut, width: largeur, height: hauteur });

  for (const taille of [320, 640]) {
    const redim = recadre.clone().resize(taille, Math.round(taille * 1.25), { fit: "fill" });
    await redim.clone().avif({ quality: 55 }).toFile(`public/medias/portraits/${sigle}-${taille}.avif`);
    await redim.clone().webp({ quality: 78 }).toFile(`public/medias/portraits/${sigle}-${taille}.webp`);
  }
  const agrandi = largeur < 640 ? ` (agrandissement ×${(640 / largeur).toFixed(2)} pour la grande taille)` : "";
  console.log(`${sigle} : recadrage ${largeur} × ${hauteur} à (${gauche}, ${haut}) sur ${width} × ${height}${agrandi}`);
}
}

preparer().catch((e) => {
  console.error(e);
  process.exit(1);
});
