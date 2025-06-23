import {
  SquareArrowDown,
  SquareArrowUp,
  CircleHelp,
  SquareArrowLeft,
  SquareArrowRight,
  MessageCircleQuestion,
  ScanEye,
} from "lucide-react";

export const getFeatureIcon = (feature: string) => {
  switch (feature) {
    //transitions
    case "cieling-up":
      return SquareArrowUp;
    case "floor-down":
      return SquareArrowDown;
    case "scene-left":
      return SquareArrowLeft;
    case "scene-right":
      return SquareArrowRight;

    //interactables
    case "basic":
      return ScanEye;
    case "investigate":
      return MessageCircleQuestion;
    default:
      return CircleHelp;
  }
};
