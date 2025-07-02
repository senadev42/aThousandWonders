import {
  InventoryItem,
  ResonanceProperties,
  AlchemicalProperties,
} from "../types";

interface AnalysisMatrix {
  item: InventoryItem;
  tool: {
    id: string;
    name: string;
  };
}

interface AnalysisResult {
  id: number;
  itemName: string;
  toolUsed: string;
  findings: string[];
  timestamp: number;
}

export const performAnalysisOnMatrix = (
  matrixSlots: AnalysisMatrix
): AnalysisResult => {
  const findings: string[] = [];
  const item = matrixSlots.item;
  const resonance = item.alchemicalProperties.resonance;

  // Analyze resonance properties if they exist
  if (resonance) {
    if (resonance.strength === "?" || resonance.purity === "?") {
      findings.push(`Resonance Strength: ${Math.floor(Math.random() * 5) + 3}`);
      findings.push(`Resonance Purity: ${Math.floor(Math.random() * 4) + 2}`);
      findings.push(
        `Grade determined: ${
          ["refined", "common", "pure"][Math.floor(Math.random() * 3)]
        }`
      );
      findings.push(`Resonance type: ${resonance.type} confirmed`);
    } else {
      findings.push(`Resonance Strength: ${resonance.strength} (confirmed)`);
      findings.push(`Resonance Purity: ${resonance.purity} (confirmed)`);
      findings.push(`Grade: ${item.grade} (verified)`);
      if (resonance.entanglements?.length) {
        findings.push(
          `Entanglements detected: ${resonance.entanglements.join(", ")}`
        );
      } else {
        findings.push("No entanglements detected");
      }
    }
  }

  // Analyze alchemical properties
  const alchemicalProps = item.alchemicalProperties;
  findings.push(`Primary Category: ${alchemicalProps.primaryCategory}`);
  if (alchemicalProps.secondaryCategory) {
    findings.push(`Secondary Category: ${alchemicalProps.secondaryCategory}`);
  }

  // Report category strengths
  Object.entries(alchemicalProps.categoryStrength).forEach(
    ([category, strength]) => {
      if (strength) {
        findings.push(
          `${
            category.charAt(0).toUpperCase() + category.slice(1)
          } strength: ${strength}`
        );
      }
    }
  );

  // Add risk assessment if available
  if (item.riskLevel) {
    findings.push(`Risk Level: ${item.riskLevel}`);
  }

  return {
    id: Date.now(),
    itemName: item.name,
    toolUsed: matrixSlots.tool.name,
    findings,
    timestamp: Date.now(),
  };
};
