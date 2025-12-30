import { BuilderState } from "./types";

export class History {
  private readonly snapshots: BuilderState[] = [];

  add(state: BuilderState) {
    this.snapshots.push(state);
  }

  latest(): BuilderState | undefined {
    return this.snapshots[this.snapshots.length - 1];
  }
}
