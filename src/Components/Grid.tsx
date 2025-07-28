import React, { useMemo } from "react";

import Styles from "./SnakeGame.module.css";
import {
  flatGrid,
  hasPosition,
  isHead,
  isSamePoint,
  Point,
} from "../Core/core.ts";
import { useSnakeGameContext } from "../Core/context.ts";

export type GridProps = {
  attributes?: React.HTMLAttributes<HTMLDivElement>;
};

export const Grid: React.FC<GridProps> = ({ attributes }) => {
  const { state, ref, blockSize } = useSnakeGameContext();
  const xLength = state.bounds ? state.bounds[1] : 0;
  const yLength = state.bounds ? state.bounds[0] : 0;
  const lost = state.playerStatus === "gameover";

  const cells: Point[] = useMemo(
    () => flatGrid(yLength, xLength),
    [xLength, yLength],
  );

  const size = xLength === 0 || yLength === 0 ? 0 : blockSize;
  return (
    <div
      {...attributes}
      ref={ref}
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
            isHead(point, state.snake) ? Styles.SnakeHead : "",
            hasPosition(state.snake, point) ? Styles.Snake : "",
            state.food && isSamePoint(point, state.food) ? Styles.Food : "",
            lost && hasPosition(state.snake, point) ? Styles.SnakeLost : "",
          ].join(" ")}
          key={`${state.bounds?.[0]}-${state.bounds?.[1]}-${point[0]}-${point[1]}`}
        />
      ))}
    </div>
  );
};
