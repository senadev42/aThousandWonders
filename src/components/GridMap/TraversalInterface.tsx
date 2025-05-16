import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import GridMapComponent from "./GridMapComponent";
import { SceneType } from "./store/state";

const TraversalInterface = () => {
  const { state, initializeScene } = useTravelStore();
  const { isInitialized } = useSnapshot(state);

  useEffect(() => {
    if (!isInitialized) {
      initializeScene({
        sceneType: SceneType.PREMADE,
        sceneId: "tavern1",
        playerPosition: {
          x: 4,
          y: 7,
        },
      });
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-200">Loading...</p>
      </div>
    );
  }

  return <GridMapComponent />;
};

// Grid Component

export default TraversalInterface;
