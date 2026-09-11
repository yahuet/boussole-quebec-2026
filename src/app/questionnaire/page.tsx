import type { Metadata } from "next";
import { QuestionnaireClient } from "@/components/ClientSeulement";

export const metadata: Metadata = { title: "Questionnaire — Boussole électorale Québec 2026" };

export default function Page() {
  return <QuestionnaireClient />;
}
