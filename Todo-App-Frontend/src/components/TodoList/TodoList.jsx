import { useContext, useEffect, useState } from "react";

import styles from "./TodoList.module.css";

import { Todo } from "../Todo/Todo";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card/Card";
import { TodoManager } from "../TodoManager/TodoManager";
import { Backdrop } from "../UI/Backdrop/Backdrop";

import { TodosContext } from "../../TodosContext.js";

import { transformTodoListBackendData } from "../../utils/utility.js";
import { Pagination } from "../Pagination/Pagination.jsx";

export function TodoList({ user }) {
  const [isAddTaskVisible, setAddTaskVisiblity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* todosLimit is the control to limit the number of todos that would 
  be fetched in one request. */
  const todosLimit = 12;

  /* todosPerPage is the control to limit the number of todos that would 
  be displayed in one page in the UI. */
  const todosPerPage = 4;

  const [totalTodosFetched, setTotalTodosFetched] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [todosOffset, setTodosOffset] = useState(0);
  const [todosGotInLastFetch, setTodosGotInLastFetch] = useState(0);

  const lastPage = Math.ceil(totalTodosFetched / todosPerPage);

  console.log(`lastPage: ${lastPage}`);
  console.log(`todosGotInLastFetch: ${todosGotInLastFetch}`);
  console.log(`totalTodosFetched: ${totalTodosFetched}`);

  useEffect(() => {
    console.log("Inside useEffect()");
    /* Even though useEffect() would run when the dependency 'currentPage' 
    changes we still need to conditionally run the fetching of todos
    only when needed. */
    if (todosData.length === 0 || currentPage === lastPage) {
      console.log("Fetching more todos...");
      fetch(
        `http://localhost:3001/todos/?userId=${user.userId}&offset=${todosOffset}&limit=${todosLimit}`,
        {
          method: "get",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.todos.length > 0) {
            // console.log(data);
            let transformedData = transformTodoListBackendData(data.todos);
            // console.log(transformedData);

            let todosInLastPage = todosData.slice(
              (lastPage - 1) * todosPerPage
            ).length;

            setTodosData([
              ...todosData,
              ...transformedData,
            ]);
            setIsLoading(false);
            setTotalTodosFetched(
              totalTodosFetched + data.todos.length
            );

            setTodosGotInLastFetch(data.todos.length);

            if (endPage === 1) {
              setEndPage(Math.ceil(data.todos.length / todosPerPage));
            } else {
              setEndPage(
                endPage +
                  Math.ceil(
                    (data.todos.length -
                      (todosPerPage - todosInLastPage)) / todosPerPage
                  )
              );
            }
          }
        });
    }
    else {
      setTotalTodosFetched(todosData.length);
      setIsLoading(false);
      setTodosOffset(todosData.length);
      setEndPage(Math.ceil(todosData.length / todosPerPage));
    }
  }, [currentPage]);

  const { todos: todosData, setTodos: setTodosData } = useContext(TodosContext);
  // console.log(todosData);

  const todos = todosData.map((todo, index) => {
    return <Todo key={todo.todoId} todo={todo} userId={user.userId} index={index} />;
  });

  const slicedTodos = todos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );

  function handlePageChange(askedPage) {
    console.log(`askedPage: ${askedPage}`);
    setCurrentPage(askedPage);

    if (askedPage === lastPage) {
      let calculatedTodosOffset =
        (lastPage - 1) * todosPerPage +
        todosData.slice((lastPage - 1) * todosPerPage).length;
      setTodosOffset(calculatedTodosOffset);
    }
  }

  function handleShowAddTask() {
    setAddTaskVisiblity(true);
  }

  function handleCloseAddTask() {
    setAddTaskVisiblity(false);
  }

  async function handleTaskAdded(task) {
    console.log("Adding task:");
    console.log(task);
    setAddTaskVisiblity(false);

    const todo = {
      userId: user.userId,
      ...task,
    };

    const response = await fetch("http://localhost:3001/todos/add", {
      method: "POST",
      body: JSON.stringify({ todo }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    setTodosData([
      ...todosData,
      {
        todoId: data.added_todo_id,
        todoName: task.todoName,
        priority: task.priority,
        todoStatus: task.status,
        deadline: task.deadline,
      },
    ]);
  }

  return (
    <>
      <Card className={styles["todos-container"]}>
        <h1>Todo List</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Button
              value="+ Add Task"
              className={styles["add-task-btn"]}
              onClick={handleShowAddTask}
            />

            <div>
              <table>
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Task Name</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{slicedTodos}</tbody>
              </table>
            </div>
          </>
        )}
      </Card>
      {isAddTaskVisible ? (
        <>
          <Backdrop />
          <TodoManager
            mode="add"
            onCancel={handleCloseAddTask}
            onAdd={handleTaskAdded}
          />
        </>
      ) : null}
      {!isLoading ? (
        <Pagination
          startPage={startPage}
          currentPage={currentPage}
          onChangePage={handlePageChange}
          endPage={endPage}
        />
      ) : null}
    </>
  );
}
