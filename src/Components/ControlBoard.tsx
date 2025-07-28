import React from "react";

import Styles from "./SnakeGame.module.css";
import { useSnakeGameContext } from "../Core/context.ts";

export const ControlBoard: React.FC = () => {
  const { state, controls } = useSnakeGameContext();

  return (
    <section className={Styles.ControlBoard}>
      <section>
        <button onClick={controls.play}>Play</button>
        <button onClick={controls.stop}>Stop</button>
        <button onClick={controls.pause}>Pause</button>
        <button onClick={controls.reset}>Reset</button>
      </section>
      <section>
        <p>{state.playerStatus}</p>
      </section>
    </section>
  );
};
