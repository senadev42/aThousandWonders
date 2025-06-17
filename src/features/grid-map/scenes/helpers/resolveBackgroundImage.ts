import { CELL_SIZE } from "@/features/grid-map/store/state";
import { SceneIdType } from "@/features/grid-map/scenes/sceneProcessor";

//assets
import guestOld from "@/assets/scenes/guestOld.png";
import messHallOld from "@/assets/scenes/messHallOld.png";

export interface SceneBackground {
  imageUrl: string;
  offset?: number;
}

export const sceneBackgrounds: Record<SceneIdType, SceneBackground> = {
  testGuest: {
    imageUrl: guestOld,
  },
  testMesshall: {
    imageUrl: messHallOld,
  },
};

export function resolveBackgroundImage(
  background: SceneBackground | undefined
): React.CSSProperties | null {
  // Return null for any scene type other than PREMADE
  if (!background) {
    return null;
  }

  const offset = background.offset ?? CELL_SIZE;

  return {
    backgroundImage: `url(${background.imageUrl})`,
    backgroundPosition: `${offset}px ${offset}px`,
    backgroundSize: `calc(100% - ${offset * 2}px) calc(100% - ${offset * 2}px)`,
    backgroundRepeat: "no-repeat",
  };
}
