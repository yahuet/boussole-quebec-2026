import type { Metadata } from "next";
import { ResultatsClient } from "@/components/ClientSeulement";

export const metadata: Metadata = { title: "Vos résultats" };

export default function Page() {
  return <ResultatsClient />;
}
