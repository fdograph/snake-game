import { createContext, useContext } from "react";
import { useSnakeGameReducer } from "./hooks.ts";

type SnakeGameContextType = ReturnType<typeof useSnakeGameReducer>;

export const SnakeGameContext = createContext<SnakeGameContextType | undefined>(
  undefined,
);

export const useSnakeGameContext = () => {
  const ctx = useContext(SnakeGameContext);

  if (!ctx) {
    throw new Error(
      "Snake Game Context not found. SnakeGameContextProvider is probably missing.",
    );
  }

  return ctx;
};
