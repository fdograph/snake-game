import React, { PropsWithChildren } from "react";
import { useSnakeGameReducer } from "./hooks.ts";
import { SnakeGameContext } from "./context.ts";

export const SnakeGameContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const ctx = useSnakeGameReducer();

  return (
    <SnakeGameContext.Provider value={ctx}>
      {children}
    </SnakeGameContext.Provider>
  );
};
