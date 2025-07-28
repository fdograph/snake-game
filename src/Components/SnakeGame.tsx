import React from "react";
import { Grid } from "./Grid.tsx";

import Styles from "./SnakeGame.module.css";
import { ControlBoard } from "./ControlBoard.tsx";
import { SnakeGameContextProvider } from "../Core/SnakeGameContextProvider.tsx";

export const SnakeGame: React.FC = () => {
  return (
    <SnakeGameContextProvider>
      <div className={Styles.GridWrapper}>
        <Grid attributes={{ className: Styles.Grid }} />
        <ControlBoard />
      </div>
    </SnakeGameContextProvider>
  );
};
