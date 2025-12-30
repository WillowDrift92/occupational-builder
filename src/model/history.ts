import { BuilderState } from "./types";

export interface HistoryStack {
  past: BuilderState[];
  present: BuilderState;
  future: BuilderState[];
}

export function createHistory(initial: BuilderState): HistoryStack {
  return { past: [], present: initial, future: [] };
}

export function pushState(stack: HistoryStack, next: BuilderState): HistoryStack {
  return { past: [...stack.past, stack.present], present: next, future: [] };
}

export function undo(stack: HistoryStack): HistoryStack {
  const previous = stack.past[stack.past.length - 1];
  if (!previous) return stack;
  const newPast = stack.past.slice(0, -1);
  return { past: newPast, present: previous, future: [stack.present, ...stack.future] };
}

export function redo(stack: HistoryStack): HistoryStack {
  const next = stack.future[0];
  if (!next) return stack;
  const newFuture = stack.future.slice(1);
  return { past: [...stack.past, stack.present], present: next, future: newFuture };
}
