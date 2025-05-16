import { SquareArrowDown, SquareArrowUp, CircleHelp } from "lucide-react";

export const getFeatureIcon = (feature: string) => {
  switch (feature) {
    case "cieling-up":
      return SquareArrowUp;
    case "floor-down":
      return SquareArrowDown;
    default:
      return CircleHelp;
  }
};
