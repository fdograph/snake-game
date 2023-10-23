import React from "react";
import "./AppStyles.css";

import { SnakeGame } from "../Components/SnakeGame.tsx";
import Styles from "./AppComponent.module.css";

export const App: React.FC = () => {
  return (
    <div className={Styles.AppWrapper}>
      <SnakeGame />
    </div>
  );
};
