import { BuilderElement, BuilderState } from "./types";

export function getSelectedElement(state: BuilderState): BuilderElement | undefined {
  return state.elements.find((element) => element.id === state.selectedElementId);
}

export function countElements(state: BuilderState) {
  return state.elements.length;
}
