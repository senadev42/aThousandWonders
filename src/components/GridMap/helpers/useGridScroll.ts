// useGridScroll.ts
import { useCallback, useEffect, useState } from "react";
import { CELL_SIZE, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../store/state";

const VISIBILITY_PADDING = 4;

// How many cells to render beyond the viewport edges
const OVERSCAN = 4;

export const useGridScroll = (
  scrollRef: React.RefObject<HTMLDivElement | null>,
  playerPosition: { x: number; y: number },
  sceneWidth: number,
  sceneHeight: number
) => {
  const [visibleRange, setVisibleRange] = useState({
    startX: 0,
    endX: 15,
    startY: 0,
    endY: 13,
  });

  // Total cells to render including overscan
  const TOTAL_VISIBLE_WIDTH = VIEWPORT_WIDTH + OVERSCAN * 2; // 17
  const TOTAL_VISIBLE_HEIGHT = VIEWPORT_HEIGHT + OVERSCAN * 2; // 15

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const scrollLeft = element.scrollLeft;
    const scrollTop = element.scrollTop;

    const startX = Math.max(0, Math.floor(scrollLeft / CELL_SIZE) - OVERSCAN);
    const startY = Math.max(0, Math.floor(scrollTop / CELL_SIZE) - OVERSCAN);
    const endX = Math.min(startX + TOTAL_VISIBLE_WIDTH, sceneWidth);
    const endY = Math.min(startY + TOTAL_VISIBLE_HEIGHT, sceneHeight);

    setVisibleRange({ startX, endX, startY, endY });
  }, [sceneWidth, sceneHeight]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const viewportWidth = element.clientWidth;
    const viewportHeight = element.clientHeight;

    const playerX = playerPosition.x * CELL_SIZE;
    const playerY = playerPosition.y * CELL_SIZE;

    const minVisibleX = element.scrollLeft;
    const maxVisibleX = minVisibleX + viewportWidth;
    const minVisibleY = element.scrollTop;
    const maxVisibleY = minVisibleY + viewportHeight;

    const padPixels = CELL_SIZE * VISIBILITY_PADDING;

    let newScrollX = element.scrollLeft;
    let newScrollY = element.scrollTop;

    if (playerX - padPixels < minVisibleX) {
      newScrollX = Math.max(0, playerX - padPixels);
    } else if (playerX + padPixels > maxVisibleX) {
      newScrollX = Math.min(
        element.scrollWidth - viewportWidth,
        playerX + padPixels - viewportWidth
      );
    }

    if (playerY - padPixels < minVisibleY) {
      newScrollY = Math.max(0, playerY - padPixels);
    } else if (playerY + padPixels > maxVisibleY) {
      newScrollY = Math.min(
        element.scrollHeight - viewportHeight,
        playerY + padPixels - viewportHeight
      );
    }

    if (newScrollX !== element.scrollLeft || newScrollY !== element.scrollTop) {
      element.scrollTo(newScrollX, newScrollY);
    }
  }, [playerPosition]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { visibleRange };
};
