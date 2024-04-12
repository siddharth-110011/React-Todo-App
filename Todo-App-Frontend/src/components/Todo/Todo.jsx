import { useNavigate } from "react-router-dom";

import { Button } from "../UI/Button";
import { getFormattedDate } from "../../utils/utility.js";

import styles from "./Todo.module.css";

export function Todo({ todo, index }) {
  const navigate = useNavigate();

  function handleNavigationToShowDetails() {
    navigate(`/todo-details/${todo.taskId}`);
  }

  return (
    <tr key={todo.taskId}>
      <td>{index + 1}</td>
      <td>{todo.todoName}</td>
      <td>{todo.priority}</td>
      <td>{todo.todoStatus}</td>
      <td>{getFormattedDate(todo.deadline)}</td>
      <td>
        <Button value="Start" className={styles["start-btn"]} />
        <Button
          value="Show details"
          className={styles["show-details-btn"]}
          onClick={handleNavigationToShowDetails}
        />
      </td>
    </tr>
  );
}
