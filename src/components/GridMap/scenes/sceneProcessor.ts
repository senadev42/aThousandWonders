//sceneProcessor.ts
import { BaseCell, BaseTiles, Scene, SceneType } from "../store/state";

import tavernScene from "./testTavernScene.json";
import testSmol from "./testSmolScene.json";

export interface TransitionDefinition {
  transitionId: string;
  transitionType: string;
  positionX: number;
  positionY: number;
  targetSceneId: string;
  targetX: number;
  targetY: number;
}

export interface RawScene {
  id: string;
  name: string;
  layout: string[];
  transitions?: TransitionDefinition[];
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
        revealed: true,
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

  let transitions: Record<string, TransitionDefinition> = {};
  if (scene.transitions) {
    scene.transitions.forEach((transition) => {
      const { positionX, positionY } = transition;

      processedData[positionY][positionX].transitionId =
        transition.transitionId;
    });

    transitions = scene.transitions.reduce(
      (acc: Record<string, TransitionDefinition>, transition) => {
        acc[transition.transitionId] = transition;

        const { positionX: x, positionY: y } = transition;

        processedData[y][x].transitionId = transition.transitionId;
        processedData[y][x].feature = transition.transitionType;

        return acc;
      },
      {}
    );
  }

  return {
    sceneType: SceneType.PREMADE,
    sceneId: scene.id,
    name: scene.name,
    width: processedData[0].length,
    height: processedData.length,
    data: processedData,
    transitions: transitions,
  };
};

export const availableScenes: Record<string, Scene> = {
  tavern1: processScene(tavernScene),
  tavernSmol: processScene(testSmol),
};

export const getSceneById = (id: string): Scene => {
  return availableScenes[id];
};
