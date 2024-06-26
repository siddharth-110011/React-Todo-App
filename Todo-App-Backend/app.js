const express = require("express");
const app = express();

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
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
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

app.use("/todos", todosRouter);
app.use("/users", usersRouter);

app.get("*", (req, res) => {
  res.status(404).send("Invalid path");
});

// Code to create the local server
app.listen(app.get("port"), () => {
  console.log("Express server running on port " + app.get("port"));
});
