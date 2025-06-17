//sceneProcessor.ts
import {
  BaseCell,
  BaseTiles,
  Scene,
  SceneType,
} from "@/features/grid-map/store/state";
import { useGridMapState } from "@/features/grid-map/store/state";
import {
  RawScene,
  SceneMetadata,
  TransitionDefinition,
} from "@/features/grid-map/scenes/types";

import tavern1 from "@scenes/testTavernScene.json";
import testSmol from "@scenes/testSmolScene.json";
import testGuest from "@scenes/testGuest.json";
import testMesshall from "@scenes/testMessHall.json";

import { sceneBackgrounds } from "./helpers/resolveBackgroundImage";

const rawScenes: Record<string, RawScene> = {
  tavern1: tavern1,
  tavernSmol: testSmol,
  testGuest: testGuest,
  testMesshall: testMesshall,
} as const;

export type SceneIdType = keyof typeof rawScenes;

export const getSceneById = (id: string): Scene => {
  const state = useGridMapState();

  // TODO: Uncomment when ready to ship (or you need it)
  // Check if scene is already processed
  // if (state.processedScenes[id]) {
  //   return state.processedScenes[id];
  // }

  // Get and process raw scene
  const rawScene = rawScenes[id];
  if (!rawScene) {
    throw new Error(`Scene with id "${id}" not found`);
  }

  const processed = processScene(rawScene);

  // Store processed scene in state
  state.processedScenes[id] = processed;

  return processed;
};

export const getAllSceneIds = (): string[] => {
  return Object.keys(rawScenes);
};

export const preloadAllScenes = (): void => {
  Object.keys(rawScenes).forEach((id) => getSceneById(id));
};

// Add this function to get available scenes metadata
export const getAvailableScenes = (): SceneMetadata[] => {
  return Object.entries(rawScenes).map(([id, scene]) => ({
    id,
    name: scene.name,
  }));
};

/**
 * Processes a raw scene into a structured format.
 *
 */
const processScene = (scene: RawScene): Scene => {
  const processedData: BaseCell[][] = [];
  const height = scene.layout.length;
  const width = scene.layout[0].length;

  // Create base grid
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

  // Add features
  if (scene.features) {
    Object.entries(scene.features).forEach(([coord, featureType]) => {
      const [x, y] = coord.split(",").map(Number);
      if (processedData[y]?.[x]) {
        processedData[y][x].feature = featureType;
      }
    });
  }

  // Add transitions
  let transitions: Record<string, TransitionDefinition> = {};
  if (scene.transitions) {
    transitions = scene.transitions.reduce(
      (acc: Record<string, TransitionDefinition>, transition) => {
        acc[transition.transitionId] = transition;
        const { x, y } = transition.position;
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
    initPosition: scene.initPosition,
    background: sceneBackgrounds[scene.id],
    name: scene.name,
    width: processedData[0].length,
    height: processedData.length,
    data: processedData,
    transitions: transitions,
  };
};
