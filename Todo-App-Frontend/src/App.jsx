import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import { Login } from "./components/static/LoginForm/login_form";
import { SignUp } from "./components/static/SignUp/signup_form";
import { Navbar } from "./components/static/Navbar/navbar";
import { HomePage } from "./components/static/HomePage/home_page";
import { TodoList } from "./components/TodoList/TodoList";
import { TodoDetails } from "./components/TodoDetails/TodoDetails";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { AuthContext, useAuthContextData } from "./auth/AuthContext.js";

import { TodosContext } from "./TodosContext.js";

import "./App.css";
import { AuthService } from "./auth/AuthService.js";

export default function App() {
  const userData = JSON.parse(localStorage.getItem("user"));
  let userDetails = null;
  if(userData) {
    userDetails = {};
    userDetails.userId = userData.userId;
    userDetails.useName = userData.userName;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(userDetails);
  const [todos, setTodos] = useState([]);
  const authContextData = useAuthContextData();
  const authService = new AuthService(null);

  useEffect(() => {
    console.log(authContextData);
    console.log("Inside App.jsx useEffect()")
    authService.validateSessionToken().then(isLoggedIn => {
      console.log("isLoggedIn: " + isLoggedIn);
      setIsAuthenticated(isLoggedIn);
    });
  }, []);

  return (
    <BrowserRouter>
        <TodosContext.Provider value={{ todos: todos, setTodos: setTodos }}>
          <AuthContext.Provider
            value={{
              authenticated: isAuthenticated,
              setIsAuthenticated: setIsAuthenticated,
            }}
          >
            <Routes>
              <Route path="/" element={<Navbar />}>
                <Route index element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? <Navigate to={"/todo-list"} /> : <Login setUser={setUser} />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isAuthenticated ? <Navigate to={"/todo-list"} /> : <SignUp />
                  }
                />

                <Route element={<PrivateRoutes />}>
                  <Route path="/todo-list" element={<TodoList user={user} />} />
                  <Route
                    path="/todo-details/:todoId"
                    element={<TodoDetails user={user}  />}
                  />
                </Route>

                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </AuthContext.Provider>
        </TodosContext.Provider>
    </BrowserRouter>
  );
}
