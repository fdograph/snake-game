import {
  calculateNext,
  Direction,
  grow,
  isSamePoint,
  pickRandom,
  Point,
  translate,
} from "./core.ts";
import { SnakeGameState } from "./SnakeGameState.ts";

/**
 * Actions Definitions
 */
const Actions = {
  setBounds: (payload: { point: Point }) => ({
    type: "setBounds" as ActionTypeKey,
    payload: payload,
  }),
  moveSnake: (payload: { direction: Direction; override?: boolean }) => ({
    type: "moveSnake" as ActionTypeKey,
    payload: payload,
  }),
  scoreIncrement: (payload: undefined = undefined) => ({
    type: "scoreIncrement" as ActionTypeKey,
    payload: payload,
  }),
} as const;
type ActionTypeKey = keyof typeof Actions;
type ActionTypePayload<T extends ActionTypeKey> = Parameters<
  (typeof Actions)[T]
>[0];
type ActionObjectFrom<T extends ActionTypeKey> = ReturnType<
  (typeof Actions)[T]
>;
type ActionObject = ActionObjectFrom<ActionTypeKey>;

/**
 * Action Handlers definition
 */
type ActionHandlersType = {
  [Key in ActionTypeKey]: (
    state: SnakeGameState,
    payload: ActionObjectFrom<Key>["payload"],
  ) => SnakeGameState;
};

type BoundActions = {
  [Key in ActionTypeKey]: (payload: ActionTypePayload<Key>) => void;
};

export const bindActions = (
  dispatch: (action: ActionObject) => void,
): BoundActions => {
  const bound: Partial<BoundActions> = {};

  const keys = Object.keys(Actions) as ActionTypeKey[];
  for (const key of keys) {
    bound[key] = (payload: ActionTypePayload<typeof key>) => {
      console.log("bound call", { payload });
      return dispatch(Actions[key](payload as never));
    };
  }

  return bound as BoundActions;
};

export const buildReducer = (defaultState: SnakeGameState) => {
  return (state: SnakeGameState = defaultState, action: ActionObject) => {
    const { type, payload } = action;
    const ActionHandlers: ActionHandlersType = {
      setBounds: (state, payload) => {
        console.log("setBounds called", { payload });
        return {
          ...state,
          bounds: payload.point,
        };
      },
      scoreIncrement: (state) => ({
        ...state,
        score: state.score + 1,
      }),
      moveSnake: (state, payload) => {
        const currentDirection = payload.override
          ? payload.direction
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
            payload.direction,
            state.bounds,
          );

          if (state.food && isSamePoint(nextHead, state.food)) {
            snake = grow(state.snake, payload.direction, state.bounds);
            food = undefined;
            score = state.score + 1;
          } else {
            snake = translate(state.snake, payload.direction, state.bounds);
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
    };
    const handler = ActionHandlers[type];

    return handler ? handler(state, payload as never) : state;
  };
};
