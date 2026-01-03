import { Snapshot } from "./types";

export function deriveStatus(state: Snapshot): string {
  return state.selectedId ? "Selection active" : "No selection";
}
