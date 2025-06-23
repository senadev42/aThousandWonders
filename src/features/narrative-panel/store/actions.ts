import { useNarrativeState } from "@/features/narrative-panel/store/state";
import {
  FullNarrativePayload,
  NarrativeEventTypeEnum,
  SceneOverview,
  StaticInteractables,
} from "@/features/narrative-panel/types";

import sceneDressingRaw from "@/features/narrative-panel/content/sceneDescriptions.json";
import staticInteractablesRaw from "@/features/narrative-panel/content/staticInteractables.json";

// Add a type assertion to allow string indexing
const sceneDressing = sceneDressingRaw as SceneOverview;
const staticInteractables = staticInteractablesRaw as StaticInteractables;

export const useNarrativeActions = () => {
  const state = useNarrativeState();

  /**
   * Adds a new narrative event to the state.
   * @param event - The narrative event to add.
   */
  const addEvent = (id: string, type: NarrativeEventTypeEnum): void => {
    // an id looks like 'testMesshall.normal' it's like a locale file key
    // use the param id to find

    let payload: FullNarrativePayload;

    switch (type) {
      case NarrativeEventTypeEnum.SCENE_DRESSING:
        payload = sceneDressing[id];
        if (!payload) return;
        const sceneDressingPayload = [
          ...state.npEvents,
          {
            id,
            type,
            payload: payload.normal,
          },
        ];
        state.npEvents = sceneDressingPayload;
        break;

      case NarrativeEventTypeEnum.INTERACTABLE:
        payload = staticInteractables[id];
        if (!payload) return;

        const staticInteractablePayload = [
          ...state.npEvents,
          {
            id,
            type,
            payload: payload.normal,
          },
        ];

        console.log(staticInteractablePayload);

        state.npEvents = staticInteractablePayload;
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
