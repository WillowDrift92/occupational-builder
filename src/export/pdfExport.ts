import jsPDF from "jspdf";
import { BuilderState } from "../model/types";

export function exportPlan(state: BuilderState) {
  const doc = new jsPDF();
  doc.text("Occupational Builder Plan", 20, 20);
  doc.text(`Units: ${state.units}`, 20, 30);
  doc.text(`Elements: ${state.elements.length}`, 20, 40);
  doc.save("occupational-builder.pdf");
}
