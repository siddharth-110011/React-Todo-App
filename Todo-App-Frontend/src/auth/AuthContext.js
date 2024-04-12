import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const useAuthContextData = () => {
  return useContext(AuthContext);
};
