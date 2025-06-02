import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "@/components/grid-map/store";
import GridMapComponent from "@/components/grid-map/GridMapComponent";
import { SceneType } from "@/components/grid-map/store/state";
import GridDebugMenu from "@/components/grid-map/GridDebugMenu";

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
    <div className="flex mt-2 items-center space-x-2">
      <div className="flex flex-col gap-y-2">
        <div className="flex h-[5rem] w-[15rem] bg-gray-900 rounded-md"></div>

        {/* Left panel 1 */}
        <div className="flex h-[15rem] w-[15rem] bg-gray-900 rounded-md"></div>

        {/* Left panel 2 */}
        <div className="flex h-[12rem] w-[15rem] bg-gray-900 rounded-md">
          <GridDebugMenu />
        </div>
      </div>

      <div className="flex flex-col gap-y-2 justify-start items-center">
        {/* The actual traversable scene map */}

        <GridMapComponent />
      </div>

      <div className="flex flex-col gap-y-2">
        {/* Right Panel 1 */}
        <div className="flex h-[10rem] w-[15rem] bg-gray-900 rounded-md"></div>

        {/* Right panel 2*/}
        <div className="flex h-[22rem] w-[15rem] bg-gray-900 rounded-md"></div>
      </div>
    </div>
  );
};

export default TraversalInterface;
