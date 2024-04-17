const express = require("express");
const router = express.Router();

const todosController = require("./todos.controller.js");
const usersController = require("../users/users.controller.js");

router.get(
  "/",
  usersController.authenticate_token,
  todosController.get_todos
);

router.get(
  "/detail",
  usersController.authenticate_token,
  todosController.get_todoDetails
);

router.post(
  "/add",
  usersController.authenticate_token,
  todosController.add_todo
);

router.put(
  "/",
  usersController.authenticate_token,
  todosController.edit_todo
);

router.delete(
  "/",
  usersController.authenticate_token,
  todosController.delete_todo
);

router.post(
  "/iteration/add",
  usersController.authenticate_token,
  todosController.add_todo_iteration
);

router.post(
  "/iteration/end",
  usersController.authenticate_token,
  todosController.end_todo_iteration
);

router.post(
  "/done",
  usersController.authenticate_token,
  todosController.mark_todo_as_done
);

module.exports = router;
