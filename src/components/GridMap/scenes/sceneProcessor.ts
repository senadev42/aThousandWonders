//sceneProcessor.ts
import { BaseCell, BaseTiles, Scene, SceneType } from "../store/state";

import tavernScene from "./testTavernScene.json";
import testSmol from "./testSmolScene.json";

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

  // First pass: Create base grid
  for (let y = 0; y < height; y++) {
    const row: BaseCell[] = [];
    for (let x = 0; x < width; x++) {
      if (scene.layout[y][x] === " ") continue;

      const type =
        scene.layout[y][x] === "X" ? BaseTiles.WALL : BaseTiles.FLOOR;

      row.push({
        type,
        revealed: false,
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
    width: processedData[0].length,
    height: processedData.length,
    data: processedData,
  };
};

export function padSceneToViewport(
  scene: Scene,
  viewportWidth: number,
  viewportHeight: number
): Scene {
  if (scene.width >= viewportWidth && scene.height >= viewportHeight) {
    return scene;
  }

  const horizontalPadding = Math.floor((viewportWidth - scene.width) / 2);
  const verticalPadding = Math.floor((viewportHeight - scene.height) / 2);

  // Create new padded data array
  const paddedData: BaseCell[][] = Array.from({ length: viewportHeight }, () =>
    Array.from({ length: viewportWidth }, () => ({
      type: BaseTiles.WALL,
      revealed: false,
    }))
  );

  // Copy original scene data into center of padded array
  for (let y = 0; y < scene.height; y++) {
    for (let x = 0; x < scene.width; x++) {
      if (scene.data[y]?.[x]) {
        const newY = y + verticalPadding;
        const newX = x + horizontalPadding;
        paddedData[newY][newX] = { ...scene.data[y][x] };
      }
    }
  }

  return {
    ...scene,
    width: viewportWidth,
    height: viewportHeight,
    data: paddedData,
  };
}

export const availableScenes: Record<string, Scene> = {
  tavern_1: processScene(tavernScene),
  tavern_smol: processScene(testSmol),
};

export const getSceneById = (id: string): Scene => {
  return availableScenes[id];
};
