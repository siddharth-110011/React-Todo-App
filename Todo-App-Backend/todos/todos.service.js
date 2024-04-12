const db = require("../db-config/database");
const { sendErrorResponse, getErrorObject } = require("../utils/utils.js");

exports.getTodos = async (userId, page, limit) => {
  // Get todo-list details for a specific userId.
  try {
    const promise = new Promise((resolve, reject) => {
      const sql = `select todo_id, todo_name, priority, todo_status, 
      deadline from todo_details where user_id = ? limit ? offset ?;`;
      const pool = db.pool;

      pool.query(sql, [userId, limit, (page-1)*limit], function (err, result) {
        if (err) {
          const internalError = new Error(err.message);
          reject(
            getErrorObject(
              internalError,
              500,
              "Something went wrong in the server!"
            )
          );
        } else {
          console.log("Todos retrieved!");
          resolve(result);
        }
      });
    });

    const result = await promise;

    return {userId: +userId, todos: result};
  } catch (error) {
    sendErrorResponse(error);
  }
};

exports.getTodoDetails = async (userId, todoId) => {
  // Get todo details for a specific (userId, todoId).
  try {
    const promise = new Promise((resolve, reject) => {
      const sql = `select * from todo_details where user_id = ${userId} 
      and todo_id = ${todoId}; select iteration_number, start_datetime, 
      end_datetime from todo_iteration_details where 
      user_id = ${userId} and todo_id = ${todoId};`;
      const pool = db.pool;

      pool.query(sql, function (err, result) {
        if (err) {
          const internalError = new Error(err.message);
          reject(
            getErrorObject(
              internalError,
              500,
              "Something went wrong in the server!"
            )
          );
        } else {
          console.log("Todo details retreived.");
          // console.log(result);
          
          if (result[0].length == 0) {
            resolve();
          }

          // Formatting the result got from two queries into a single object.
          let toDetails = {
            ...result[0][0],
            iteration_details: result[1],
          };
          resolve(toDetails);
        }
      });
    });

    const result = await promise;

    return result;
  } catch (error) {
    sendErrorResponse(error);
  }
};

exports.addTodo = async (todo) => {
  // Add the todo to the database.

  const connection = await db.getConnectionFromPool();

  try {
    const sql = `call add_todo (?, ?, ?, ?, ?, ? ,?, @added_todo_id);
        select @added_todo_id as added_todo_id;`;

    const promise = new Promise((resolve, reject) => {
      const res = {};
      connection.query(
        sql,
        [
          todo.userId,
          todo.todoName,
          todo.todoType,
          todo.priority,
          todo.todoStatus,
          todo.todoDescription,
          todo.deadline,
        ],
        function (err, result) {
          if (err) {
            const internalError = new Error(err.message);

            reject(
              getErrorObject(
                internalError,
                500,
                "Something went wrong in the server!"
              )
            );
          } else {
            console.log("Todo added.");

            let addTodoResponse = result[1][0];
            resolve(addTodoResponse);
          }
        }
      );
    });

    const result = await promise;

    return result;
  } catch (error) {
    sendErrorResponse(error);
  } finally {
    connection.release(); // Release the connection back to the pool.
    console.log("Connection released!");
  }
};

exports.deleteTodo = async (userId, todoId) => {
  // Delete todo correpsonding to (userId, todoId).
  try {
    const promise = new Promise((resolve, reject) => {
      const sql = `delete from todo_details where user_id = ? and 
      todo_id = ?;`;
      const pool = db.pool;

      pool.query(sql, [userId, todoId], function (err, result) {
        if (err) {
          const internalError = new Error(err.message);
          reject(
            getErrorObject(
              internalError,
              500,
              "Something went wrong in the server!"
            )
          );
        } else {
          // console.log(result);
          console.log("Todo deleted.");
          resolve(result);
        }
      });
    });

    const result = await promise;

    return result;
  } catch (error) {
    sendErrorResponse(error);
  }
};

exports.addTodoIteration = async (userId, todoId) => {
  // Add the todoIteration to the database.
  try {
    const promise = new Promise((resolve, reject) => {
      const sql = `call add_todo_iteration (?, ?);`;
      const pool = db.pool;

      pool.query(sql, [userId, todoId], function (err, result) {
        if (err) {
          const internalError = new Error(err.message);
          reject(
            getErrorObject(
              internalError,
              500,
              "Something went wrong in the server!"
            )
          );
        } else {
          console.log("Todo iteration added.");
          console.log(result);
          resolve();
        }
      });
    });

    const result = await promise;

    return result;
  } catch (error) {
    sendErrorResponse(error);
  }
};
