import { proxy } from "valtio";

export enum Views {
  REGION = "REGION",
  STRATEGIC = "STRATEGIC",
  LOCAL = "LOCAL",

  // Add more views as needed
}

export const gameState = proxy({
  currentView: Views.LOCAL,
  setView: (view: Views) => {
    gameState.currentView = view;
  },
});
