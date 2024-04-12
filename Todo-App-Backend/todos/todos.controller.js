const todosService = require("./todos.service.js");

exports.get_todos = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  console.log("req.query:");
  console.log(req.query);

  let userIdsMatching = compareUserIdsInTokenAndRequest(
    +req.query.userId,
    req.body.userDataFromToken.userId
  );


  let page = +req.query.page;
  let limit = +req.query.limit;

  if(isNaN(page) || page <= 0) {
    page = 1;
  } 

  if(isNaN(limit) || limit < 0) {
    limit = 5;
  } 

  if(userIdsMatching) {
    todosService
    .getTodos(req.query.userId, page, limit)
    .then((todoListDetails) => {
      res.send(todoListDetails);
    })
    .catch((err) => {
      console.log("Error occurred while retrieving todo-list details!");
      res.status(err.error.statusCode).send(err);
    });
  }
  else {
    res.status(403).send(accessDeniedErrorResponse);
  }
  
};

exports.get_todoDetails = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  console.log("req.query:");
  console.log(req.query);

  let userIdsMatching = compareUserIdsInTokenAndRequest(
    +req.query.userId,
    req.body.userDataFromToken.userId
  );

  if(userIdsMatching) {
    todosService
      .getTodoDetails(req.query.userId, req.query.todoId)
      .then((todoDetails) => {
        res.send(todoDetails);
      })
      .catch((err) => {
        console.log("Error occurred while retrieving todo details!");
        res.status(err.error.statusCode).send(err);
      });
  }
  else {
    res.status(403).send(accessDeniedErrorResponse);
  }

};

exports.add_todo = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  let userIdsMatching = compareUserIdsInTokenAndRequest(
    req.body.todo.userId,
    req.body.userDataFromToken.userId
  );

  if(userIdsMatching) {
    todosService
      .addTodo(req.body.todo)
      .then((addTodoResponse) => {
        res.send(addTodoResponse);
      })
      .catch((err) => {
        console.log("Error occurred while adding a todo!");
        res.status(err.error.statusCode).send(err);
      });
  }
  else {
    res.status(403).send(accessDeniedErrorResponse);
  }

};

exports.delete_todo = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  let userIdsMatching = compareUserIdsInTokenAndRequest(
    req.body.userId,
    req.body.userDataFromToken.userId
  );

  if(userIdsMatching) {
    todosService
      .deleteTodo(req.body.userId, req.body.todoId)
      .then((result) => {
        console.log(result);
        res.send();
      })
      .catch((err) => {
        console.log("Error occurred while deleting a todo!");
        res.status(err.error.statusCode).send(err);
      });
  }
  else {
    res.status(403).send(accessDeniedErrorResponse);
  }

};

exports.add_todo_iteration = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  let userIdsMatching = compareUserIdsInTokenAndRequest(
    req.body.userId,
    req.body.userDataFromToken.userId
  );

  if(userIdsMatching) {
    todosService
      .addTodoIteration(req.body.userId, req.body.todoId)
      .then((todoId) => {
        res.send(todoId);
      })
      .catch((err) => {
        console.log("Error occurred while adding a todoIteration!");
        res.status(err.error.statusCode).send(err);
      });
  }
  else {
    res.status(403).send(accessDeniedErrorResponse);
  }

};

function compareUserIdsInTokenAndRequest(userIdFromReq, userIdFromToken) {
  if (userIdFromReq !== userIdFromToken) {
    return false;
  } else {
    return true;
  }
}

let accessDeniedErrorResponse = {
  error: {
    message: "Access Denied: You are not authorized to access this resource.",
  },
};
