import { Direction, Point, Snake } from "./core.ts";

export type PlayerState = "playing" | "paused" | "gameover";

export type SnakeGameState = {
  snake: Snake;
  currentDirection: Direction;
  playerState: PlayerState;
  food: Point | undefined;
  bounds: Point | undefined;
  score: number;
};

export const defaultState: SnakeGameState = {
  snake: [{ point: [0, 0] }],
  currentDirection: "right",
  playerState: "playing",
  food: undefined,
  bounds: undefined,
  score: 0,
};
