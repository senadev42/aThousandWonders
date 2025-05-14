import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { SceneType } from "./store/state";
import { useState } from "react";
import { availableScenes } from "./scenes/sceneProcessor";

const GridDebugMenu = () => {
  const { state, initializeScene, updateDebugSettings } = useTravelStore();
  const { debugInfo } = useSnapshot(state);

  const [selectedType, setSelectedType] = useState<SceneType>(SceneType.EMPTY);
  const [seed, setSeed] = useState<string>("");
  const [sceneId, setSceneId] = useState<string>("");

  const handleSceneSelect = () => {
    switch (selectedType) {
      case SceneType.RANDOM:
        initializeScene({
          sceneType: SceneType.RANDOM,
          seed: seed ? parseInt(seed) : Math.floor(Math.random() * 10000),
        });
        break;
      case SceneType.EMPTY:
        initializeScene({
          sceneType: SceneType.EMPTY,
        });
        break;
      case SceneType.PREMADE:
        initializeScene({
          sceneType: SceneType.PREMADE,
          sceneId: sceneId,
        });
        break;
    }
  };

  return (
    <div className="flex justify-between items-start bg-gray-900 p-4 rounded text-white text-xs h-[8rem] w-[30rem]">
      {/* Debug Information */}
      <div className="text-gray-200 space-x-2">
        {/* Cell being hovered over */}
        <p>{debugInfo.playerPosition}</p>

        <div className="mt-2 flex items-center  ">
          <input
            type="checkbox"
            className="mr-2 size-3"
            onChange={(e) => {
              updateDebugSettings({
                showCoords: e.target.checked,
              });
            }}
          />
          <span>Show Coords</span>
        </div>
      </div>

      {/* Regen section */}
      <div className="text-gray-200 w-[15rem]">
        <div className="border-slate-400 rounded-md mt-2">
          {/* Drop down with 3 options, empty map, random map, and a scene */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="bg-gray-800 text-gray-200 p-1 rounded w-2/3"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as SceneType)}
              >
                <option value={SceneType.EMPTY}>Empty Map</option>
                <option value={SceneType.RANDOM}>Random Map</option>
                <option value={SceneType.PREMADE}>Premade Map</option>
              </select>
              <button
                className="bg-slate-500 text-white text-xs p-1 rounded disabled:cursor-not-allowed flex-1"
                onClick={handleSceneSelect}
                disabled={selectedType === SceneType.PREMADE && !sceneId}
              >
                Generate
              </button>
            </div>

            {selectedType === SceneType.RANDOM && (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={debugInfo.seed.toString()}
                  className="bg-gray-800 text-gray-200 p-1 rounded flex-1"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
            )}

            {selectedType === SceneType.PREMADE && (
              <div className="flex gap-2">
                <select
                  className="bg-gray-800 text-gray-200 p-1 text-xs rounded flex-1"
                  value={sceneId}
                  onChange={(e) => setSceneId(e.target.value)}
                >
                  <option value="">Select a scene...</option>
                  {Object.entries(availableScenes).map(([id, scene]) => (
                    <option key={id} value={id}>
                      {scene.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridDebugMenu;
