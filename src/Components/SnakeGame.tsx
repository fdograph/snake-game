import React from "react";
import { Grid } from "./Grid.tsx";

import Styles from "./SnakeGame.module.css";
import { useSnakeGameReducer } from "../Core/hooks.ts";
import { Keyboard } from "./Keyboard.tsx";

const TICK_RATE = 1000 / 10;
const BLOCK_SIZE = 30;
export const SnakeGame: React.FC = () => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [state] = useSnakeGameReducer(gridRef, TICK_RATE, BLOCK_SIZE);

  return (
    <div className={Styles.GridWrapper}>
      <Grid
        gridRef={gridRef}
        attributes={{ className: Styles.Grid }}
        xLength={state.bounds ? state.bounds[1] : 0}
        yLength={state.bounds ? state.bounds[0] : 0}
        blockSize={BLOCK_SIZE}
        snake={state.snake}
        food={state.food}
        boundaries={state.bounds}
        lost={state.playerState === "gameover"}
      />
      <Keyboard />
    </div>
  );
};
