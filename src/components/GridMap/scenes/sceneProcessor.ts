//sceneProcessor.ts
import { BaseCell, BaseTiles, Scene, SceneType } from "../store/state";
import tavernScene from "./testTavernScene.json";

export interface RawScene {
  id: string;
  name: string;
  layout: string[];
  features: Record<string, string>;
}

const processScene = (scene: RawScene): Scene => {
  const processedData: BaseCell[][] = [];
  const height = scene.layout.length;
  const width = scene.layout[0].length;

  console.log("Processing scene", scene.id, "with dimensions", width, height);

  // First pass: Create base grid
  for (let y = 0; y < height; y++) {
    const row: BaseCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        type: scene.layout[y][x] === "X" ? BaseTiles.WALL : BaseTiles.FLOOR,
        revealed: true,
        feature: undefined,
      });
    }
    processedData.push(row);
  }

  // Second pass: Add features
  Object.entries(scene.features).forEach(([coord, featureType]) => {
    const [x, y] = coord.split(",").map(Number);
    if (processedData[y]?.[x]) {
      processedData[y][x].feature = featureType;
    }
  });

  return {
    sceneType: SceneType.PREMADE,
    sceneId: scene.id,
    name: scene.name,
    width,
    height,
    data: processedData,
  };
};

export const availableScenes: Record<string, Scene> = {
  tavern_1: processScene(tavernScene),
};

export const getSceneById = (id: string): Scene => {
  console.log("Processing scene", id, "with dimensions");

  return availableScenes[id];
};
