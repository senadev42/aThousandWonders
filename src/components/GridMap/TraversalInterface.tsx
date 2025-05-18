import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import GridMapComponent from "./GridMapComponent";
import { SceneType } from "./store/state";
import GridDebugMenu from "./GridDebugMenu";

const TraversalInterface = () => {
  const { state, initializeScene } = useTravelStore();
  const { isInitialized } = useSnapshot(state);

  useEffect(() => {
    if (!isInitialized) {
      initializeScene({
        sceneType: SceneType.PREMADE,
        sceneId: "testGuest",
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

  return (
    <div className="flex flex-col gap-2 items-center justify-start w-full mt-10">
      <GridMapComponent />
      <GridDebugMenu />
    </div>
  );
};

// Grid Component

export default TraversalInterface;
