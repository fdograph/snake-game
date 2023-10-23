import React from "react";
import { Grid } from "./Grid.tsx";

import Styles from "./SnakeGame.module.css";
import { useSnakeGame } from "../Core/hooks.ts";
import { Keyboard } from "./Keyboard.tsx";

const TICK_RATE = 1000 / 10;
const BLOCK_SIZE = 30;
export const SnakeGame: React.FC = () => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [snake, food, bounds = [0, 0], lost] = useSnakeGame(
    gridRef,
    TICK_RATE,
    BLOCK_SIZE,
  );

  return (
    <div className={Styles.GridWrapper}>
      <Grid
        gridRef={gridRef}
        attributes={{ className: Styles.Grid }}
        xLength={bounds[0]}
        yLength={bounds[1]}
        snake={snake}
        food={food}
        boundaries={bounds}
        lost={lost}
      />
      <Keyboard />
    </div>
  );
};
