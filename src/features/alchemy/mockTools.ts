import { ToolItem } from "./types";

export const mockTools: ToolItem[] = [
  {
    id: "resonance_lens_01",
    type: "tool",
    name: "Precision Resonance Lens",
    description: "Crystalline lens for detailed resonance analysis",
    function: "observation",
    precision: "precise",
    marketPrice: 450,
    condition: 92,
    specializations: [
      {
        category: "crystalline",
        effectiveness: 4,
      },
      {
        resonanceType: "stellshade",
        effectiveness: 3,
      },
    ],
    riskLevel: "low",
  },
];
