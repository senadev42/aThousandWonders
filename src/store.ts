import { proxy } from "valtio";

export enum Views {
  STRATEGIC = "STRATEGIC",
  LOCAL = "LOCAL",
  // Add more views as needed
}

export const gameState = proxy({
  currentView: Views.STRATEGIC,
  setView: (view: Views) => {
    gameState.currentView = view;
  },
});
