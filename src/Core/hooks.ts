import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { Action, Direction, Point, isSamePoint } from "./core.ts";
import { defaultState } from "./SnakeGameState.ts";
import { bindActions, buildReducer } from "./SnakeGameActions.ts";

const ActionCommandKeys: Record<Action, Set<string>> = {
  pause: new Set([" ", "enter", "return", "p"]),
};

const DirectionCommandKeys: Record<Direction, Set<string>> = {
  up: new Set(["arrowup", "w"]),
  down: new Set(["arrowdown", "s"]),
  left: new Set(["arrowleft", "a"]),
  right: new Set(["arrowright", "d"]),
};

const CommandKeys = {
  ...DirectionCommandKeys,
  ...ActionCommandKeys,
};

const isDirectionCommand = (key: string): key is Direction => {
  return Object.keys(DirectionCommandKeys).includes(key);
};

const resolveCommand = (key: string) => {
  return (Object.keys(CommandKeys) as Array<keyof typeof CommandKeys>).find(
    (dir) => CommandKeys[dir].has(key),
  );
};

const resolveDirection = (from: Direction, key: string): Direction => {
  const to = resolveCommand(key) ?? "";

  if (!to || from === to || !isDirectionCommand(to)) {
    return from;
  }

  switch (from) {
    case "up":
      return to !== "down" ? to : from;
    case "down":
      return to !== "up" ? to : from;
    case "left":
      return to !== "right" ? to : from;
    case "right":
      return to !== "left" ? to : from;
    default:
      return from;
  }
};

export const useSnakeGameReducer = (
  gridRef: React.RefObject<HTMLElement>,
  speed: number,
  blockSize: number,
) => {
  const [snakeState, dispatch] = useReducer(
    buildReducer(defaultState),
    defaultState,
  );
  const boundActions = useMemo(() => bindActions(dispatch), [dispatch]);
  const calculateBounds = useCallback((): Point => {
    const rect = gridRef.current?.getBoundingClientRect();
    const height = rect?.height ?? 0;
    const width = rect?.width ?? 0;
    const rows = Math.floor(height / blockSize);
    const cols = Math.floor(width / blockSize);

    return [rows, cols];
  }, [gridRef, blockSize]);

  useEffect(() => {
    let ticker: NodeJS.Timeout | undefined;
    const play = () => {
      ticker = setTimeout(() => {
        if (snakeState.playerState === "gameover") {
          console.log("Player lost, stopping ticker");
          return;
        }

        boundActions.moveSnake({
          direction: snakeState.currentDirection,
        });
        play();
      }, speed);
    };
    const stop = () => {
      clearTimeout(ticker);
      ticker = undefined;
    };
    const pause = () => {
      return ticker ? stop() : play();
    };
    const setBoundsFromRef = () => {
      const newBounds = calculateBounds();
      if (!snakeState.bounds || !isSamePoint(snakeState.bounds, newBounds)) {
        console.log("bounds", { newBounds });
        boundActions.setBounds({ point: newBounds });
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (CommandKeys.pause.has(key)) {
        pause();
      }

      if (!ticker) {
        // is paused or stopped
        return;
      }

      const dir = resolveDirection(snakeState.currentDirection, key);

      if (dir === snakeState.currentDirection) {
        return;
      }

      boundActions.moveSnake({ direction: dir, override: true });
    };
    const registerEvents = () => {
      window.addEventListener("resize", setBoundsFromRef);
      window.addEventListener("keydown", handleKeyDown);
    };
    const deregisterEvents = () => {
      window.removeEventListener("resize", setBoundsFromRef);
      window.removeEventListener("keydown", handleKeyDown);
    };

    // init
    setBoundsFromRef();
    registerEvents();
    play();

    return () => {
      deregisterEvents();
      stop();
    };
  }, [
    blockSize,
    boundActions,
    calculateBounds,
    gridRef,
    snakeState.bounds,
    snakeState.currentDirection,
    snakeState.playerState,
    speed,
  ]);

  return [snakeState, dispatch] as const;
};
