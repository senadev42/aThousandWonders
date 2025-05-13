//sceneProcessor.ts
import { BaseCell, BaseTiles, Scene, SceneType } from "../store/state";
import tavernScene from "./testTavernScene.json";

export interface RawScene {
  id: string;
  name: string;
  layout: string[];
  features?: Record<string, string>;
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
      if (scene.layout[y][x] === " ") continue;

      const type =
        scene.layout[y][x] === "X" ? BaseTiles.WALL : BaseTiles.FLOOR;

      row.push({
        type,
        revealed: true,
        feature: undefined,
      });
    }
    processedData.push(row);
  }

  // Second pass: Add features
  if (scene.features) {
    Object.entries(scene.features).forEach(([coord, featureType]) => {
      const [x, y] = coord.split(",").map(Number);
      if (processedData[y]?.[x]) {
        processedData[y][x].feature = featureType;
      }
    });
  }

  return {
    sceneType: SceneType.PREMADE,
    sceneId: scene.id,
    name: scene.name,
    width,
    height,
    data: processedData,
  };
};

export const padSceneToViewport = (
  scene: Scene,
  viewportWidth: number,
  viewportHeight: number
): Scene => {
  if (scene.width >= viewportWidth && scene.height >= viewportHeight) {
    return scene;
  }

  const paddedWidth = Math.max(scene.width, viewportWidth);
  const paddedHeight = Math.max(scene.height, viewportHeight);

  // Calculate padding for centering
  const xOffset = Math.floor((paddedWidth - scene.width) / 2);
  const yOffset = Math.floor((paddedHeight - scene.height) / 2);

  // Create new padded data array filled with walls
  const paddedData: BaseCell[][] = Array.from(
    { length: paddedHeight - 1 },
    () =>
      Array.from({ length: paddedWidth - 1 }, () => ({
        type: BaseTiles.WALL,
        revealed: true,
        feature: undefined,
      }))
  );

  // Copy original scene data to center of padded array
  for (let y = 0; y < scene.height; y++) {
    for (let x = 0; x < scene.width; x++) {
      paddedData[y + yOffset][x + xOffset] = scene.data[y][x];
    }
  }

  return {
    ...scene,
    width: paddedWidth,
    height: paddedHeight,
    data: paddedData,
  };
};

export const availableScenes: Record<string, Scene> = {
  tavern_1: processScene(tavernScene),
};

export const getSceneById = (id: string): Scene => {
  console.log("Processing scene", id, "with dimensions");

  return availableScenes[id];
};
