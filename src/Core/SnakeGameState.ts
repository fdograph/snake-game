import {
  calculateNext,
  Direction,
  grow,
  isSamePoint,
  pickRandom,
  Point,
  Snake,
  translate,
} from "./FunctionalSnake.ts";
import { SnakeGameAction, SnakeGameActionsType } from "./SnakeGameAction.ts";

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

type SnakeGameActionsHandlerMap = {
  [key in SnakeGameActionsType]: (
    state: SnakeGameState,
    action: Omit<Extract<SnakeGameAction, { type: key }>, never>,
  ) => SnakeGameState;
};
export const buildSnakeGameReducer = (handlers: SnakeGameActionsHandlerMap) => {
  return (state: SnakeGameState = defaultState, action: SnakeGameAction) => {
    const type = action.type;
    const handler = handlers[type] as
      | ((
          state: SnakeGameState,
          action: Extract<SnakeGameAction, { type: typeof type }>,
        ) => SnakeGameState)
      | undefined;

    return handler ? handler(state, action) : state;
  };
};

export const snakeGameReducer = buildSnakeGameReducer({
  SET_BOUNDS: (state, action) => ({
    ...state,
    bounds: action.payload,
  }),
  SCORE_INCREMENT: (state) => ({
    ...state,
    score: state.score + 1,
  }),
  MOVE_SNAKE: (state, action) => {
    const currentDirection = action.payload.override
      ? action.payload.direction
      : state.currentDirection;
    let score = state.score;
    let food = state.food;
    let snake = state.snake;
    let playerState = state.playerState;

    if (state.playerState === "gameover" || state.bounds === undefined) {
      return state;
    }

    try {
      const nextHead = calculateNext(
        state.snake,
        action.payload.direction,
        state.bounds,
      );

      if (state.food && isSamePoint(nextHead, state.food)) {
        snake = grow(state.snake, action.payload.direction, state.bounds);
        food = undefined;
        score = state.score + 1;
      } else {
        snake = translate(state.snake, action.payload.direction, state.bounds);
      }
    } catch (e) {
      console.error(e);
      playerState = "gameover";
    }

    if (food === undefined) {
      food = pickRandom(state.bounds, snake);
    }

    return { ...state, currentDirection, snake, food, score, playerState };
  },
});
