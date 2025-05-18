import {
  SquareArrowDown,
  SquareArrowUp,
  CircleHelp,
  SquareArrowLeft,
  SquareArrowRight,
} from "lucide-react";

export const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case "cieling-up":
      return SquareArrowUp;
    case "floor-down":
      return SquareArrowDown;
    case "scene-left":
      return SquareArrowLeft;
    case "scene-right":
      return SquareArrowRight;
    default:
      return CircleHelp;
  }
};
