import { createContext } from "react";

export const TodosContext = createContext({ todos: {}, setTodos: () => {} });

export const TodoActionsDispatchContext = createContext(null);
