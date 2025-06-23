import { useState } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "@/features/grid-map/store";
import { SceneType } from "@/features/grid-map/store/state";
import { getAvailableScenes } from "@/features/grid-map/sceneProcessor";

const GridDebugMenu = () => {
  const { state, initializeScene, updateDebugSettings } = useTravelStore();
  const { debugInfo } = useSnapshot(state);
  const availableScenes = getAvailableScenes();

  const [selectedType, setSelectedType] = useState<SceneType>(
    state.currentScene.sceneType
  );
  const [seed, setSeed] = useState<string>("");
  const [sceneId, setSceneId] = useState<string>(availableScenes[0]?.id || "");

  const handleSceneSelect = () => {
    switch (selectedType) {
      case SceneType.MAZE:
        initializeScene({
          sceneType: SceneType.MAZE,
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
      case SceneType.DUNGEON:
        initializeScene({
          sceneType: SceneType.DUNGEON,
          seed: seed ? parseInt(seed) : Math.floor(Math.random() * 10000),
        });
        break;
    }
  };

  return (
    <div className="flex flex-col justify-start bg-gray-900 p-3 gap-y-2 rounded text-white text-xs">
      {/* Cell being hovered over */}
      <p>{debugInfo.playerPosition}</p>
      {/* Debug Information */}
      <div className="text-gray-200 space-x-2 grid grid-cols-2">
        <div className="mt-2 flex items-center  ">
          <input
            checked={debugInfo.showCoords}
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

        <div className="mt-2 flex items-center  ">
          <input
            checked={debugInfo.showMousePosTooltip}
            type="checkbox"
            className="mr-2 size-3"
            onChange={(e) => {
              updateDebugSettings({
                showMousePosTooltip: e.target.checked,
              });
            }}
          />
          <span>Show Mousetooltip</span>
        </div>

        <div className="mt-2 flex items-center  ">
          <input
            checked={debugInfo.toggleOverlay}
            type="checkbox"
            className="mr-2 size-3"
            onChange={(e) => {
              updateDebugSettings({
                toggleOverlay: e.target.checked,
              });
            }}
          />
          <span>Toggle Overlay</span>
        </div>

        <div className="mt-2 flex items-center  ">
          <input
            disabled
            checked={debugInfo.showScollbar}
            type="checkbox"
            className="mr-2 size-3"
            onChange={(e) => {
              updateDebugSettings({
                showScollbar: e.target.checked,
              });
            }}
          />
          <span>Toggle Scrollbar</span>
        </div>
      </div>

      {/* Regen section */}
      <div className="text-gray-200 w-[18rem]">
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
                <option value={SceneType.MAZE}>Random Map</option>
                <option value={SceneType.PREMADE}>Premade Map</option>
                <option value={SceneType.DUNGEON}>Dungeon Map</option>
              </select>
              <button
                className="bg-slate-500 text-white text-xs p-1 rounded disabled:cursor-not-allowed flex-1"
                onClick={handleSceneSelect}
                disabled={selectedType === SceneType.PREMADE && !sceneId}
              >
                Generate
              </button>
            </div>

            {(selectedType === SceneType.MAZE ||
              selectedType === SceneType.DUNGEON) && (
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
                  onChange={(e) => {
                    setSceneId(e.target.value);
                  }}
                >
                  {availableScenes.map((scene) => {
                    return (
                      <option key={scene.id} value={scene.id}>
                        {scene.name} ({scene.id})
                      </option>
                    );
                  })}
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
