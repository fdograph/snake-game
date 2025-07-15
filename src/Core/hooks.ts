import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const controls = useMemo(() => {
    const play = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        intervalRef.current = setInterval(() => {
          if (snakeState.playerState === "gameover") {
            console.log("Player lost, stopping ticker");
            return;
          }

          boundActions.moveSnake({
            direction: snakeState.currentDirection,
          });
        }, speed);
      }
    };
    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isRunningRef.current = false;
    };
    const pause = () => {
      if (isRunningRef.current) {
        return stop();
      }

      return play();
    };

    return {
      play,
      stop,
      pause,
    };
  }, [
    boundActions,
    snakeState.currentDirection,
    snakeState.playerState,
    speed,
  ]);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (CommandKeys.pause.has(key)) {
        controls.pause();
        return;
      }
      if (!isRunningRef.current) {
        return;
      }

      const dir = resolveDirection(snakeState.currentDirection, key);

      if (dir === snakeState.currentDirection) {
        return;
      }

      boundActions.moveSnake({ direction: dir, override: true });
    },
    [boundActions, controls, snakeState.currentDirection],
  );
  const calculateBounds = useCallback((): Point => {
    const rect = gridRef.current?.getBoundingClientRect();
    const height = rect?.height ?? 0;
    const width = rect?.width ?? 0;
    const rows = Math.floor(height / blockSize);
    const cols = Math.floor(width / blockSize);

    return [rows, cols];
  }, [gridRef, blockSize]);

  useEffect(() => {
    controls.stop();
    controls.play();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      controls.stop();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [controls, handleKeyDown]);

  useEffect(() => {
    const setBoundsFromRef = () => {
      const newBounds = calculateBounds();
      if (!snakeState.bounds || !isSamePoint(snakeState.bounds, newBounds)) {
        boundActions.setBounds({ point: newBounds });
      }
    };

    // init
    setBoundsFromRef();
    window.addEventListener("resize", setBoundsFromRef);

    return () => {
      window.removeEventListener("resize", setBoundsFromRef);
    };
  }, [boundActions, calculateBounds, snakeState.bounds]);

  return useMemo(
    () => ({
      state: snakeState,
      actions: boundActions,
      controls,
    }),
    [boundActions, controls, snakeState],
  );
};
