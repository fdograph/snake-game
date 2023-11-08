import { Direction, Point } from "./FunctionalSnake.ts";

const createAction = <Type extends Readonly<string>, Payload>(
  type: Type,
  payload: Payload,
) => ({
  type,
  payload,
});

const createActionType = <T extends Readonly<string>, P>(type: T) => {
  return (payload: P) => createAction<T, P>(type, payload);
};

export const SnakeGameActionMap = {
  setBounds: createActionType<"SET_BOUNDS", Point>("SET_BOUNDS"),
  moveSnake: createActionType<
    "MOVE_SNAKE",
    { direction: Direction; override?: boolean }
  >("MOVE_SNAKE"),
  scoreIncrement: createActionType<"SCORE_INCREMENT", undefined>(
    "SCORE_INCREMENT",
  ),
} as const;

export type SnakeGameActions = {
  [key in keyof typeof SnakeGameActionMap]: ReturnType<
    (typeof SnakeGameActionMap)[key]
  >;
}[keyof typeof SnakeGameActionMap];

export type SnakeGameActionsTypes = SnakeGameActions["type"];
