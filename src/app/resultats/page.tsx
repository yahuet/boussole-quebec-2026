import type { Metadata } from "next";
import { ResultatsClient } from "@/components/ClientSeulement";

export const metadata: Metadata = { title: "Vos résultats — Boussole électorale Québec 2026" };

export default function Page() {
  return <ResultatsClient />;
}
