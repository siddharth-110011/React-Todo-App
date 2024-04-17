import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import { Button } from "../UI/Button";
import { getFormattedDateTimeForUI } from "../../utils/utility.js";

import {TodosContext} from "../../TodosContext.js";

import styles from "./Todo.module.css";

export function Todo({ todo, index, userId }) {
  const navigate = useNavigate();
  const [taskStarted, setTaskStarted] = useState(
    todo.todoStatus === "In Progress"
  );
  const { todos: todosData, setTodos: setTodosData } = useContext(TodosContext);

  function handleNavigationToShowDetails() {
    navigate(`/todo-details/${todo.todoId}`);
  }

  async function handleStart() {
    setTaskStarted(false);
    const response = await fetch("http://localhost:3001/todos/iteration/add", {
      method: "POST",
      body: JSON.stringify({ userId: userId, todoId: todo.todoId }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    
    if(data.add_iteration_status === "iteration_added") {
      setTaskStarted(true);

      setTodosData(todosData.map(t => {
        if(t.todoId === todo.todoId) {
          return {...t, todoStatus: "In Progress"}
        }
        else {
          return t;
        }
      }));
    }
  }

  async function handleEnd() {
    const response = await fetch("http://localhost:3001/todos/iteration/end", {
      method: "POST",
      body: JSON.stringify({ userId: userId, todoId: todo.todoId }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    if(data.end_iteration_status === "todo_latest_iteration_ended") {
      setTaskStarted(false);

      setTodosData(todosData.map(t => {
        if(t.todoId === todo.todoId) {
          return {...t, todoStatus: "Paused"}
        }
        else {
          return t;
        }
      }));
    }
  }

  let startStopBtn = null;

  if (todo.todoStatus !== "Done") {
    startStopBtn = taskStarted ? (
      <Button value="Stop" className={styles["stop-btn"]} onClick={handleEnd} />
    ) : (
      <Button
        value="Start"
        className={styles["start-btn"]}
        onClick={handleStart}
      />
    );
  }

  return (
    <tr key={todo.todoId}>
      <td>{index + 1}</td>
      <td>{todo.todoName}</td>
      <td>{todo.priority}</td>
      <td>{todo.todoStatus}</td>
      <td>{todo.deadline ? getFormattedDateTimeForUI(todo.deadline) : "NA"}</td>
      <td>
        {startStopBtn}
        <Button
          value="Show details"
          className={styles["show-details-btn"]}
          onClick={handleNavigationToShowDetails}
        />
      </td>
    </tr>
  );
}
