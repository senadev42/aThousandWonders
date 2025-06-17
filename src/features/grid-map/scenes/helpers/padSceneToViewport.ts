import { Scene, BaseCell, BaseTiles } from "../../store/state";
import { TransitionDefinition } from "@/features/grid-map/scenes/types";

/**
 * Pads the scene to fit the viewport dimensions by adding walls around the original scene.
 * @deprecated in favor of just conditionally centering it, this deeply deeply messes up the transition coord system
 * @returns
 */
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
  // Adjust transition positions
  const shiftedTransitions: Record<string, TransitionDefinition> = {};

  if (scene.transitions) {
    Object.entries(scene.transitions).forEach(([id, transition]) => {
      shiftedTransitions[id] = {
        ...transition,
        position: {
          x: transition.position.x + horizontalPadding,
          y: transition.position.y + verticalPadding,
        },
      };
    });
  }

  return {
    ...scene,
    width: viewportWidth,
    height: viewportHeight,
    data: paddedData,
  };
}
