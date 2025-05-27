import { useEffect, useRef, useState } from "react";
import khorSmall from "@/assets/khorSmall.png";
import { regionNodeData } from "@/components/region-map/regionData";
import { PolyPoint, Polygon, Region, CanvasState } from "./types";

const RegionMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CanvasState>({
    mousePosition: [0, 0],
    showTooltip: false,
    clickedPoints: [],
    selectedRegion: null,
  });

  const isPointInPolygon = (
    x: number,
    y: number,
    polygon: Polygon
  ): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const drawRegions = (
    ctx: CanvasRenderingContext2D,
    highlight: string | null = null
  ): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    regionNodeData.forEach((region) => {
      ctx.beginPath();
      ctx.moveTo(...(region.points[0] as PolyPoint));
      region.points
        .slice(1)
        .forEach((point) => ctx.lineTo(...(point as PolyPoint)));
      ctx.closePath();

      const regionIsSelected = state.selectedRegion?.name;

      ctx.fillStyle = "transparent";

      if (regionIsSelected === region.name) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;

        ctx.setLineDash([10, 5]);
        ctx.lineDashOffset = 2;

        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawRegions(ctx, state.selectedRegion?.name);
  }, [state.selectedRegion]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedRegion = regionNodeData.find((region) =>
      isPointInPolygon(x, y, region.points as PolyPoint[])
    );

    const selectedRegion = clickedRegion
      ? {
          ...clickedRegion,
          points: clickedRegion.points as PolyPoint[],
        }
      : null;

    setState((prev) => ({
      ...prev,
      selectedRegion,
      clickedPoints: [...prev.clickedPoints, [x, y]],
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setState((prev) => ({
      ...prev,
      mousePosition: [x, y],
    }));
  };

  const handleTooltipVisibility = (visible: boolean) => {
    setState((prev) => ({ ...prev, showTooltip: visible }));
  };

  return (
    <div className="flex p-4 gap-4">
      <div
        className="relative rounded-lg"
        style={{
          flex: 1,
          backgroundImage: `url(${khorSmall})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={655}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => handleTooltipVisibility(true)}
          onMouseLeave={() => handleTooltipVisibility(false)}
          className="cursor-crosshair"
        />
        {state.showTooltip && (
          <div
            className="absolute bg-black text-white px-2 py-1 rounded text-sm pointer-events-none"
            style={{
              left: state.mousePosition[0] + 10,
              top: state.mousePosition[1] + 10,
            }}
          >
            {state.mousePosition.map(Math.round).join(", ")}
          </div>
        )}
      </div>

      <RegionInfoPanel region={state.selectedRegion} />
    </div>
  );
};

const RegionInfoPanel = ({ region }: { region: Region | null }) => (
  <div className="flex flex-col justify-between gap-4">
    <div className="w-72 rounded-lg shadow-lg h-fit mb-4">
      <h2 className="p-2 rounded-md bg-amber-50 text-xl font-bold mb-4 text-amber-900">
        Region Information
      </h2>
      <div className="bg-amber-50 h-72 rounded-sm p-2 text-black flex flex-col items-center justify-start">
        {region ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{region.name}</h3>
            <p className="text-xs">{region.info.type}</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <strong>Resources:</strong> {region.info.resources}
              </p>
              <p>
                <strong>Settlements:</strong> {region.info.settlements}
              </p>
              <p className="mt-4 text-sm">{region.info.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-black text-center text-sm">
            Select a region to view its information
          </p>
        )}
      </div>
    </div>
  </div>
);

export default RegionMap;
