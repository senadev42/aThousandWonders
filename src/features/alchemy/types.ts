// Core alchemical properties
export type ResonanceType =
  | "the_search"
  | "the_sable_shore"
  | "stellshade"
  | "prismlight"
  | "efflorescence";

export type AlchemicalCategory =
  | "crystalline" // Holds/amplifies resonance
  | "volatile" // Reacts strongly/unstably
  | "binding" // Stabilizes/fixes effects
  | "catalytic"; // Modifies resonance behavior

export interface ResonanceProperties {
  type: ResonanceType;
  strength: number | "?";
  purity: number | "?";
  entanglements?: ResonanceType[];
}

export interface AlchemicalProperties {
  primaryCategory: AlchemicalCategory;
  secondaryCategory?: AlchemicalCategory;
  categoryStrength: {
    crystalline?: number;
    volatile?: number;
    binding?: number;
    catalytic?: number;
  };
  resonance?: ResonanceProperties;
}

export interface BaseItem {
  type: "item" | "tool";
}

//Generic Inventory Types
export interface InventoryItem extends BaseItem {
  id: string;
  name: string;
  description: string;
  marketPrice?: number;
  grade?: "common" | "refined" | "pure" | "perfect";
  riskLevel?: "low" | "moderate" | "high" | "extreme";
  notes?: string;
  alchemicalProperties: AlchemicalProperties;
}

///Tools

export type ToolFunction =
  | "observation" // Basic analysis
  | "refinement" // Improving purity
  | "extraction" // Pulling out specific properties
  | "synthesis" // Combining elements
  | "stabilization" // Managing volatile reactions
  | "resonance" // Working with resonance specifically
  | "catalysis"; // Modifying reaction properties

export type ToolPrecision =
  | "crude"
  | "standard"
  | "fine"
  | "precise"
  | "masterwork";

export type ToolSpecialization = {
  category?: AlchemicalCategory; // If specialized for specific category
  resonanceType?: ResonanceType; // If specialized for specific resonance
  effectiveness: number; // 1-5 rating
};

export interface ToolItem extends BaseItem {
  id: string;
  name: string;
  description: string;
  function: ToolFunction;
  precision: ToolPrecision;
  marketPrice: number;
  condition?: number; // 0-100%
  specializations?: ToolSpecialization[];
  requirements?: {
    skill?: string;
    certification?: string;
  };
  notes?: string;
  riskLevel?: "low" | "moderate" | "high" | "extreme";
}

//Post Analysis

export interface AnalysisResult {
  id: number;
  itemName: string;
  toolUsed: string;
  findings: string[];
  timestamp: number;
  resonanceReadings?: {
    type: ResonanceType;
    strength: number;
    purity: number;
    notes: string;
  }[];
}
