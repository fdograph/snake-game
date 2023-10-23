import React, { useEffect, useState } from "react";
import {
  Snake,
  Action,
  Direction,
  Point,
  pickRandom,
  isSamePoint,
  calculateNext,
  grow,
  translate,
} from "./FunctionalSnake.ts";

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

export const useSnakeGame = (
  gridRef: React.RefObject<HTMLElement>,
  speed: number,
  blockSize: number,
): [Snake, Point | undefined, Point | undefined, boolean] => {
  const [bounds, setBounds] = useState<Point | undefined>(undefined);
  const [direction, setDirection] = useState<Direction>("right");
  const [snake, setSnake] = useState<Snake>([{ point: [0, 0] }]);
  const [food, setFood] = useState<Point | undefined>(undefined);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    let ticker: NodeJS.Timeout | undefined;

    const updateFood = (s: Snake): Point | undefined => {
      if (bounds === undefined) return undefined;
      return pickRandom(bounds, s);
    };
    const moveSnake = (dir: Direction) => {
      if (lost || bounds === undefined) return;

      try {
        const nextHead = calculateNext(snake, dir, bounds);

        let newFood = food;
        let newSnake = snake;
        if (newFood && isSamePoint(nextHead, newFood)) {
          newSnake = grow(snake, dir, bounds);
          newFood = updateFood(newSnake);
        } else {
          newSnake = translate(snake, dir, bounds);
        }

        setSnake(newSnake);
        setFood(newFood ?? updateFood(newSnake));
      } catch (e) {
        console.log(e);
        setLost(true);
      }
    };

    const play = () => {
      ticker = setTimeout(() => {
        moveSnake(direction);
      }, speed);
    };

    const stop = () => {
      clearTimeout(ticker);
      ticker = undefined;
    };

    const pause = () => {
      return ticker ? stop() : play();
    };

    const calculateBounds = (): Point => {
      const rows = Math.floor((gridRef.current?.clientHeight ?? 0) / blockSize);
      const cols = Math.floor((gridRef.current?.clientWidth ?? 0) / blockSize);

      return [rows, cols];
    };
    const setBoundsFromRef = () => {
      requestAnimationFrame(() => {
        const newBounds = calculateBounds();
        if (!bounds || !isSamePoint(bounds, newBounds)) {
          setBounds(newBounds);
        }
      });
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

      const dir = resolveDirection(direction, key);

      if (dir === direction) {
        return;
      }

      stop();
      setDirection(dir);
      moveSnake(dir);
    };

    const registerEvents = () => {
      window.addEventListener("resize", setBoundsFromRef);
      window.addEventListener("keydown", handleKeyDown);
    };
    const deregisterEvents = () => {
      window.removeEventListener("resize", setBoundsFromRef);
      window.removeEventListener("keydown", handleKeyDown);
    };

    // init effect
    setBoundsFromRef();
    registerEvents();

    play();
    console.log("init");

    return () => {
      deregisterEvents();
      stop();
    };
  }, [blockSize, bounds, direction, food, gridRef, lost, snake, speed]);

  return [snake, food, bounds, lost];
};
