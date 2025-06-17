import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "@/features/grid-map/store";
import GridMapComponent from "@/features/grid-map/GridMapComponent";
import { SceneType } from "@/features/grid-map/store/state";
import GridDebugMenu from "@/features/grid-map/GridDebugMenu";
import { FileSearch, Search } from "lucide-react";

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
    <div className="flex items-center space-x-2">
      <div className="flex flex-col gap-y-2">
        {/* Status Strip */}

        <div className="flex h-[8rem] w-[20rem] bg-gray-900 rounded-md">
          {/* A line that indicates current time, gold, shade marks*/}

          {/* A line that indicates current status effects */}
        </div>

        {/* Left panel 1 */}
        <div className="flex h-[18rem] w-[20rem] bg-gray-900 rounded-md">
          {/* A line that indicates current time, gold, shade marks*/}

          {/* A line that indicates current status effects */}
        </div>

        {/* Left panel 2 */}
        <div className="flex h-[12rem] w-[20rem] bg-gray-900 rounded-md">
          <GridDebugMenu />
        </div>
      </div>

      <div className="flex flex-col gap-y-1 justify-start items-start">
        {/* The actual traversable scene map */}
        <div className="flex h-[2rem] w-full bg-gray-900 rounded-md">
          <div className="flex justify-between items-center p-2 text-gray-200 w-full">
            {/* Location */}
            <div className="flex items-center gap-x-2">
              <span className="text-amber-500">☀</span>
              <p className="text-sm italic text-gray-400">
                4:23 PM - Mess Hall, Dusk Serpent
              </p>
            </div>

            <div className="flex gap-x-2">
              <div className="flex items-center">
                <span className="text-yellow-400">⦿</span>
                <span className="ml-2">2,450</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-400">◈</span>
                <span className="ml-2">12</span>
              </div>
            </div>
          </div>
        </div>
        <GridMapComponent />
      </div>

      <div className="flex flex-col gap-y-2">
        {/* The GM panel where it's basically running commentary on what character
        is doing. It's both like a log and also paragraphs on paragraphs*/}
        <div className="flex h-[15rem] w-[20rem] bg-gray-900 rounded-md">
          <div className="flex-1 overflow-y-auto scrollbar-custom">
            <div className="flex flex-col p-3 text-gray-200 space-y-2">
              <hr className="text-gray-500 text-translucent" />

              <p className="text-sm">
                You wander through the dimly lit mess hall, weaving between long
                wooden tables and benches. The space is empty and quiet, save
                for the echo of your footsteps on the stone floor.
              </p>

              <p className="text-sm">
                You spot shards of broken glass scattered by the wall. A light
                red pool of liquid spreads slowly from the shattered bottle,
                looking at first glance like spilled wine.
              </p>

              <div className="text-xs text-gray-400 italic flex items-center gap-x-1">
                {/* investigation icon */}

                <Search size={12} />

                <span>Investigation Check: </span>
                <span className="text-green-400">Success</span>
              </div>

              <div className="border-l-2 border-purple-500 pl-2">
                <p className="text-sm italic text-purple-300">
                  The bottle's label is partially intact - you can make out
                  "Celesrose Wine". Somewhat of a rare vintage, wierd to find it
                  here in pieces in the mess hall.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel 2*/}
        <div className="flex h-[23rem] w-[20rem] bg-gray-900 rounded-md">
          <div className="flex flex-col p-3 text-gray-200 w-full">
            <div className="border-b border-gray-700 pb-2 mb-2">
              <h3 className="text-gray-400 text-sm">Available Interactions</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraversalInterface;
