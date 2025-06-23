import {
  NarrativeEventTypeEnum,
  useNarrativeState,
} from "@/features/narrative-panel/store/state";

import sceneDressingRaw from "@/features/narrative-panel/content/sceneDescriptions.json";
import { SceneNPDescriptions } from "../types";

// Add a type assertion to allow string indexing
const sceneDressing = sceneDressingRaw as SceneNPDescriptions;

export const useNarrativeActions = () => {
  const state = useNarrativeState();

  /**
   * Adds a new narrative event to the state.
   * @param event - The narrative event to add.
   */
  const addEvent = (id: string, type: NarrativeEventTypeEnum): void => {
    // an id looks like 'testMesshall.normal' it's like a locale file key
    // use the param id to find

    switch (type) {
      case NarrativeEventTypeEnum.SCENE_DRESSING:
        const content = sceneDressing[id];

        if (!content) return;

        const npEventsPayload = [
          ...state.npEvents,
          {
            id,
            type,
            payload: content.normal,
          },
        ];

        state.npEvents = npEventsPayload;

        break;
      default:
        break;
    }
  };

  const clearEvents = () => {
    state.npEvents = [];
  };

  return {
    addEvent,
    clearEvents,
  };
};
