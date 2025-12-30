import { BuilderState } from "./types";

export function deriveStatus(state: BuilderState): string {
  return state.mode === "edit" ? "Editing" : "Previewing";
}
