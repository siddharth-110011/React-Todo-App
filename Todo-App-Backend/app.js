const express = require("express");
const path = require("path");
const app = express();
const cookie = require("cookie");
const cors = require("cors");

require("dotenv").config();

// This is an Express method used to set various settings or properties on
// the application object.
app.set("port", process.env.PORT || 3000);

const todosRouter = require("./todos/todos.router.js");
const usersRouter = require("./users/users.router.js");

app.use(express.json()); // Parse JSON request bodies

app.use((req, res, next) => {
  console.log(`\n${"-".repeat(50)}`);
  console.log("Request Type: " + req.method);
  console.log("Request url: " + req.url);

  next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", true);

    /* For the preflight request the request method is of type options. That is why
    we are sending a 200 Ok response in that case because it is issued by browser to
    see if the CORS protocol is understood and a server is aware using specific
    methods and headers. */
    if(req.method === "Options") {
        return res.statusCode(200).json();
    }
    next();
})

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Change to your React app's origin
//     credentials: true,
//   })
// );

app.post("/getCookie", (req, res) => {
  let token = cookie.serialize("token", "Token 123", {
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    // sameSite: "none",
  });
  // Setting the cookie 'token' at the client side.
  res.setHeader("Set-Cookie", token);
  res.send("Cookie sent!");
});

app.get("/sendCookie", (req, res) => {
  const cookiesReceived = cookie.parse(req.headers.cookie || "");
  console.log("Cookie Received:", cookiesReceived);

  if (!isObjectEmpty(cookiesReceived)) {
    res.send("Cookie received!");
  } else {
    res.send("Cookie not received!");
  }
});

app.get("/deleteCookie", (req, res) => {
  const cookiesReceived = cookie.parse(req.headers.cookie || "");
  console.log("Cookie Received:", cookiesReceived);

  res.clearCookie("token");

  if (!isObjectEmpty(cookiesReceived)) {
    res.send("Cookie received and cleared!");
  } else {
    res.send("Cookie not received!");
  }
});

const isObjectEmpty = (objectName) => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};

app.use("/todos", todosRouter);
app.use("/users", usersRouter);

app.get("*", (req, res) => {
  res.status(404).send("Invalid path");
});

// Code to create the local server
app.listen(app.get("port"), () => {
  console.log("Express server running on port " + app.get("port"));
});
