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

export type PlayerState = "playing" | "paused" | "gameover";
export type SnakeGameState = {
  snake: Snake;
  currentDirection: Direction;
  playerState: PlayerState;
  food: Point | undefined;
  bounds: Point | undefined;
};

export type SnakeGameActionTypes =
  | {
      type: "SET_DIRECTION";
      payload: { direction: Direction };
    }
  | {
      type: "SET_PLAYER_STATE";
      payload: { playerState: PlayerState };
    }
  | {
      type: "SET_BOUNDS";
      payload: { bounds: Point };
    }
  | {
      type: "SET_FOOD";
      payload: { food: Point | undefined };
    }
  | {
      type: "SET_SNAKE";
      payload: { snake: Snake };
    }
  | {
      type: "MOVE_SNAKE";
      payload: { direction: Direction; override?: boolean };
    };

export type SnakeGameActionTypeValues = SnakeGameActionTypes["type"];

export const defaultState: SnakeGameState = {
  snake: [{ point: [0, 0] }],
  currentDirection: "right",
  playerState: "playing",
  food: undefined,
  bounds: undefined,
};
export const buildSnakeGameReducer = (handlers: {
  [key in SnakeGameActionTypeValues]: (
    state: SnakeGameState,
    action: Extract<SnakeGameActionTypes, { type: key }>,
  ) => SnakeGameState;
}) => {
  return (
    state: SnakeGameState = defaultState,
    action: SnakeGameActionTypes,
  ) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action as never) : state;
  };
};

export const snakeGameReducer = buildSnakeGameReducer({
  SET_DIRECTION: (state, action) => ({
    ...state,
    currentDirection: action.payload.direction,
  }),
  SET_PLAYER_STATE: (state, action) => ({
    ...state,
    playerState: action.payload.playerState,
  }),
  SET_BOUNDS: (state, action) => ({
    ...state,
    bounds: action.payload.bounds,
  }),
  SET_FOOD: (state, action) => ({
    ...state,
    food: action.payload.food,
  }),
  SET_SNAKE: (state, action) => ({
    ...state,
    snake: action.payload.snake,
  }),
  MOVE_SNAKE: (state, action) => {
    const { playerState, snake, bounds, food } = state;
    const newState = { ...state };
    let turnFood = food;

    if (playerState === "gameover" || bounds === undefined) {
      return state;
    }

    if (action.payload.override) {
      newState.currentDirection = action.payload.direction;
    }

    try {
      const nextHead = calculateNext(snake, action.payload.direction, bounds);

      if (turnFood && isSamePoint(nextHead, turnFood)) {
        newState.snake = grow(snake, action.payload.direction, bounds);
        turnFood = undefined;
      } else {
        newState.snake = translate(snake, action.payload.direction, bounds);
      }
    } catch (e) {
      console.log(e);
      newState.playerState = "gameover";
    }

    console.log("turnFood", turnFood);

    if (turnFood === undefined) {
      newState.food = pickRandom(bounds, newState.snake);
    }

    return newState;
  },
});
