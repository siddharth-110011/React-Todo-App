import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import { initialTodosData } from "./initialTodos.js";

import "./App.css";

export default function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ? true : false;
  const userData = JSON.parse(localStorage.getItem("user"));
  let userDetails = null;
  if(userData) {
    userDetails = {};
    userDetails.userId = userData.userId;
    userDetails.useName = userData.userName;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const [user, setUser] = useState(userDetails);
  const [todos, setTodos] = useState([]);

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
                    isAuthenticated ? <Navigate to="/todo-List" /> : <Login setUser={setUser} />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isAuthenticated ? <Navigate to="/todo-List" /> : <SignUp />
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
