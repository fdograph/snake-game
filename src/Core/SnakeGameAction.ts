import { Direction, Point } from "./FunctionalSnake.ts";

const createAction =
  <T extends Readonly<string>, P>(type: T) =>
  (payload: P) => ({
    type,
    payload,
  });

export const SnakeGameActionCreators = {
  setBounds: createAction<"SET_BOUNDS", Point>("SET_BOUNDS"),
  moveSnake: createAction<
    "MOVE_SNAKE",
    { direction: Direction; override?: boolean }
  >("MOVE_SNAKE"),
  scoreIncrement: createAction<"SCORE_INCREMENT", undefined>("SCORE_INCREMENT"),
} as const;

export type SnakeGameAction = {
  [key in keyof typeof SnakeGameActionCreators]: ReturnType<
    (typeof SnakeGameActionCreators)[key]
  >;
}[keyof typeof SnakeGameActionCreators];

export type SnakeGameActionsType = SnakeGameAction["type"];
