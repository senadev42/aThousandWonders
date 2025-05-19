import { useEffect } from "react";
import { isAdjacent } from "@/components/grid-map/store/actions";
import { GridPosition, Scene } from "@/components/grid-map/store/state";

export const useKeyboardControls = (
  playerPosition: GridPosition,
  currentScene: Scene,
  movePlayer: (x: number, y: number) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (e.key) {
        case "ArrowUp":
          newY--;
          break;
        case "ArrowDown":
          newY++;
          break;
        case "ArrowLeft":
          newX--;
          break;
        case "ArrowRight":
          newX++;
          break;
        default:
          return;
      }

      // Check if the new position is within bounds
      if (
        newX >= 0 &&
        newX < currentScene.width &&
        newY >= 0 &&
        newY < currentScene.height
      ) {
        const targetCell = currentScene.data[newY][newX];
        // Only move if the cell is adjacent and not a wall
        if (
          isAdjacent(newX, newY, playerPosition, targetCell.type === "wall")
        ) {
          movePlayer(newX, newY);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, currentScene, movePlayer]);
};
