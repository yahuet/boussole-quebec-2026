import { useSyncExternalStore } from "react";

const abonner = () => () => {};

/** true dans le navigateur, false pendant le rendu statique (évite les écarts d'hydratation). */
export function useClient(): boolean {
  return useSyncExternalStore(abonner, () => true, () => false);
}
