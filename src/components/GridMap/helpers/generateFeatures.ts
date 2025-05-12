import { FEATURES, BASE_TILES } from "../constants";
import { FeatureType, TacticalGridMap } from "../store/state";

const FEATURE_CHANCES = {
  RUIN: {
    baseChance: 0.01,
    depthMultiplier: 0.05, // increases with depth
  },
  CRYSTAL: {
    baseChance: 0.005,
    depthMultiplier: 0.1, // increases more with depth
  },
  DANGER: {
    baseChance: 0.002,
    depthMultiplier: 0.1, // increases most with depth
  },
} as const;

// Helper function to determine which feature to place
function determineFeature(depth: number): FeatureType {
  const normalizedDepth = Math.min(depth / 10, 1);

  // Calculate chances for each feature based on depth
  const chances = {
    RUIN:
      FEATURE_CHANCES.RUIN.baseChance +
      FEATURE_CHANCES.RUIN.depthMultiplier * normalizedDepth,
    CRYSTAL:
      FEATURE_CHANCES.CRYSTAL.baseChance +
      FEATURE_CHANCES.CRYSTAL.depthMultiplier * normalizedDepth,
    DANGER:
      FEATURE_CHANCES.DANGER.baseChance +
      FEATURE_CHANCES.DANGER.depthMultiplier * normalizedDepth,
  };

  const roll = Math.random();

  // Cumulative probability check
  let cumulativeProbability = 0;

  if (roll < (cumulativeProbability += chances.RUIN)) return FEATURES.RUIN;
  if (roll < (cumulativeProbability += chances.CRYSTAL))
    return FEATURES.CRYSTAL;
  if (roll < (cumulativeProbability += chances.DANGER)) return FEATURES.DANGER;

  return null;
}

export function generateFeatures(
  tacticalGridMap: TacticalGridMap
): TacticalGridMap {
  // Iterate through the grid
  for (let y = 0; y < tacticalGridMap.length; y++) {
    for (let x = 0; x < tacticalGridMap[y].length; x++) {
      // Only place features on tunnel tiles
      if (tacticalGridMap[y][x].type === BASE_TILES.TUNNEL) {
        //depth == farther away from middle
        const depthValue = Math.abs(Math.floor(tacticalGridMap.length / 2) - y);

        // Check if we should place a feature here
        const feature = determineFeature(depthValue);
        if (feature) {
          tacticalGridMap[y][x].feature = feature;
        }
      }
    }
  }

  return tacticalGridMap;
}
