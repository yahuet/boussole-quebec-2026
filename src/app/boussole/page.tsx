import type { Metadata } from "next";
import { QuestionnaireClient } from "@/components/ClientSeulement";

export const metadata: Metadata = { title: "La boussole" };

export default function Page() {
  return <QuestionnaireClient />;
}
