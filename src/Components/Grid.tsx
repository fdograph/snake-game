import React, { useMemo } from "react";

import Styles from "./SnakeGame.module.css";
import {
  gridLoop,
  hasPosition,
  isHead,
  isSamePoint,
  Point,
  Snake,
} from "../Core/FunctionalSnake.ts";

export type GridProps = {
  xLength: number;
  yLength: number;
  blockSize: number;
  snake?: Snake;
  food?: Point;
  boundaries?: Point;
  lost: boolean;
  gridRef?: React.Ref<HTMLDivElement>;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
};

export const Grid: React.FC<GridProps> = ({
  xLength,
  yLength,
  blockSize,
  snake = [],
  food,
  lost,
  boundaries = [0, 0],
  gridRef,
  attributes,
}) => {
  const cells: Point[] = useMemo(
    () =>
      gridLoop(xLength, yLength, (point) => point).reduce(
        (acc, pointRow) => [...acc, ...pointRow],
        [],
      ),
    [xLength, yLength],
  );

  const size = xLength === 0 || yLength === 0 ? 0 : blockSize;
  return (
    <div
      {...attributes}
      ref={gridRef}
      style={{
        ["--x-length" as never]: xLength,
        ["--y-length" as never]: yLength,
        ["--block-size" as never]: `${size}px`,
      }}
    >
      {cells.map((point: Point) => (
        <div
          className={[
            Styles.Cell,
            isHead(point, snake) ? Styles.SnakeHead : "",
            hasPosition(snake, point) ? Styles.Snake : "",
            food && isSamePoint(point, food) ? Styles.Food : "",
            lost && hasPosition(snake, point) ? Styles.SnakeLost : "",
          ].join(" ")}
          key={`${boundaries[0]}-${boundaries[1]}-${point[0]}-${point[1]}`}
        />
      ))}
    </div>
  );
};
