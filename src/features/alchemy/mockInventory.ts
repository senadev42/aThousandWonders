import { InventoryItem } from "./types";

// Mock inventory data
export const mockInventory: InventoryItem[] = [
  {
    id: "ds_crystal_01",
    type: "item",
    name: "Desert Quartz",
    description: "Naturally occurring crystal with strong resonance retention",
    grade: "refined",
    riskLevel: "low",
    marketPrice: 150,
    alchemicalProperties: {
      primaryCategory: "crystalline",
      secondaryCategory: "binding",
      categoryStrength: {
        crystalline: 4,
        binding: 1,
      },
      resonance: {
        type: "stellshade",
        strength: 3,
        purity: 2,
      },
    },
  },
  {
    id: "vp_essence_01",
    type: "item",
    name: "Veiled Petal Essence",
    description: "Distilled essence of night-blooming desert flowers",
    grade: "pure",
    riskLevel: "moderate",
    marketPrice: 300,
    alchemicalProperties: {
      primaryCategory: "catalytic",
      categoryStrength: {
        catalytic: 3,
        volatile: 1,
      },
      resonance: {
        type: "the_sable_shore",
        strength: 2,
        purity: 4,
        entanglements: ["stellshade"],
      },
    },
  },
  {
    id: "void_moss_01",
    type: "item",
    name: "Void Moss Extract",
    description: "Stabilizing agent derived from cave-dwelling moss",
    grade: "common",
    riskLevel: "low",
    marketPrice: 75,
    alchemicalProperties: {
      primaryCategory: "binding",
      categoryStrength: {
        binding: 3,
      },
      resonance: {
        type: "stellshade",
        strength: 1,
        purity: 3,
      },
    },
  },
  {
    id: "qs_dust_01",
    type: "item",
    name: "Quicksilver Dust",
    description: "Highly reactive mineral powder, handle with care",
    grade: "refined",
    riskLevel: "extreme",
    marketPrice: 450,
    alchemicalProperties: {
      primaryCategory: "volatile",
      secondaryCategory: "catalytic",
      categoryStrength: {
        volatile: 5,
        catalytic: 2,
      },
      resonance: {
        type: "prismlight",
        strength: 4,
        purity: 3,
        entanglements: ["the_search"],
      },
    },
  },
];
