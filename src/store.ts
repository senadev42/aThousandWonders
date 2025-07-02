import { proxy } from "valtio";

export enum Views {
  //Traversal
  REGION = "REGION",
  STRATEGIC = "STRATEGIC",
  LOCAL = "LOCAL",

  //crafting?
  ALCHEMY = "ALCHEMY",

  // Add more views as needed
}

export const gameState = proxy({
  currentView: Views.LOCAL,
  setView: (view: Views) => {
    gameState.currentView = view;
  },
});
