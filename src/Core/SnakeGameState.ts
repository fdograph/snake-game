import { Direction, Point, Snake } from "./core.ts";

export type PlayerStatus = "playing" | "paused" | "gameover";

export type SnakeGameState = {
  snake: Snake;
  currentDirection: Direction;
  playerStatus: PlayerStatus;
  food: Point | undefined;
  bounds: Point | undefined;
  score: number;
};

export const defaultState: SnakeGameState = {
  snake: [{ point: [0, 0] }],
  currentDirection: "right",
  playerStatus: "playing",
  food: undefined,
  bounds: undefined,
  score: 0,
};
