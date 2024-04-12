import React, { useState } from "react";
import "./navbar.css"; // Import CSS file for styling
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthContextData } from "../../../auth/AuthContext";
import { AuthService } from "../../../auth/AuthService";

export function Navbar() {
  const { authenticated } = useAuthContextData();
  const authContextData = useAuthContextData();
  const authService = new AuthService(authContextData);

  // const [color, changeColor] = useState("");
  // const location = useLocation();

  // console.log(location);

  // const backgroundColors = {
  //   "/": "aqua",
  //   "/home": "aqua",
  //   "/signup": "pink",
  //   "/login": "pink",
  // };

  // if (color === "") {
  //   document.body.style.backgroundColor = backgroundColors[location.pathname];
  // } else {
  //   document.body.style.backgroundColor = color;
  // }

  return (
    <>
      <div className="navbar">
        <div className="nav-items">
          <Link
            to="/home"
            // onClick={() => changeColor(backgroundColors["/home"])}
          >
            Home
          </Link>
          {authenticated ? (
            <>
             <Link
                to="/todo-list"
              >
                Dashboard
              </Link>
              <Link
                to="/login"
                onClick = {() => authService.logout() }
              >
                Logout
              </Link>
            </>
          ) : (
            <>
             <Link
                to="/login"
                // onClick={() => changeColor(backgroundColors["/login"])}
              >
                Login
              </Link>
              <Link
                to="/signup"
                // onClick={() => changeColor(backgroundColors["/signup"])}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
