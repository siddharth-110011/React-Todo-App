import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./TodoDetails.module.css";

import { Card } from "../UI/Card/Card";
import { Button } from "../UI/Button";
import { TodoManager } from "../TodoManager/TodoManager";
import { Backdrop } from "../UI/Backdrop/Backdrop";

import { TodosContext } from "../../TodosContext.js";
import { transformTodoListBackendData } from "../../utils/utility.js";

export const TodoDetails = ({ user }) => {
  // let initialTodoDetails = {
  //   taskId: "101",
  //   todoName: "Buying Groceries",
  //   todoType: "Daily Task",
  //   todoStatus: "InProgress",
  //   priority: "High",
  //   deadLine: "16-March-2024",
  //   startDateTime: "16-December-2024, 9:00AM",
  //   endDateTime: "16-March-2024,10:00AM",
  // };

  const navigate = useNavigate();

  const { todoId } = useParams();
  console.log(todoId);

  const { todos: todosData, setTodos: setTodosData } = useContext(TodosContext);
  console.log(todosData);

  // const initialTodoDetails = todosData.find(todo => todo.id == todoId);

  const [todoDetails, setTodoDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let message = `Buy the following    items:
1. Eggs
2. Bread
3. Butter
4. Apples
5. Milk
6. Dal`;

  useEffect(() => {
    const fetchTodoDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/todos/detail?userId=${user.userId}&todoId=${todoId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        let transformedData = transformTodoListBackendData([data]);
        console.log(data);
        console.log(transformedData);

        setTodoDetails(transformedData[0]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching todo details:", err);
      }
    };

    fetchTodoDetails();
  }, []);

  function handleShowEditTask() {
    setIsEditing(true);
  }

  function handleCloseEditTask() {
    setIsEditing(false);
  }

  function handleTaskEdited(task) {
    console.log("Saving task:");
    console.log(task);
  }

  function handleNavigationToTodoList() {
    navigate("/todo-list");
  }

  return !isLoading ? (
    <>
      <Card className={styles["todo-details-container"]}>
        <h2>{todoDetails.todoName}</h2>
        <div className={styles["action-buttons-container"]}>
          {/* <button type="Submit">Edit</button> */}
          <Button
            value="Edit"
            className={styles["add-task-btn"]}
            onClick={handleShowEditTask}
          />
          <Button
            value="Go back to Todo list"
            onClick={handleNavigationToTodoList}
          />
        </div>
        <section className={styles["todo-details-section"]}>
          <h4>Details:</h4>
          <div className={styles["todo-details"]}>
            <div>
              <span className={styles["detail-label"]}>Task Type:</span>
              <span className={styles["detail-value"]}>
                {todoDetails.todoType}
              </span>
            </div>
            <div>
              <span className={styles["detail-label"]}>Status: </span>
              <span className={styles["detail-value"]}>
                {todoDetails.todoStatus}
              </span>
            </div>
            <div>
              <span className={styles["detail-label"]}>Priority: </span>
              <span className={styles["detail-value"]}>
                {todoDetails.priority}
              </span>
            </div>
            <div>
              <span className={styles["detail-label"]}>Deadline: </span>
              <span className={styles["detail-value"]}>
                {todoDetails.deadLine || "NA"}
              </span>
            </div>
            <div>
              <span className={styles["detail-label"]}>Start Date Time: </span>
              <span className={styles["detail-value"]}>
                {todoDetails.startDateTime || "-"}
              </span>
            </div>
            <div>
              <span className={styles["detail-label"]}>End Date Time: </span>
              <span className={styles["detail-value"]}>
                {todoDetails.endDateTime || "-"}
              </span>
            </div>
          </div>
        </section>
        <section className={styles["todo-decription-section"]}>
          <h4>Description:</h4>
          <pre>{todoDetails.todoDescription || "Not available"}</pre>
        </section>
        {todoDetails.iterationDetails.length > 0 ? (
          <section className={styles["todo-iterations-section"]}>
            <h4>Iterations:</h4>
            <table>
              <tbody>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Time Took</th>
                </tr>
              </tbody>
              <tbody>
                {todoDetails.iterationDetails.map((iterationDetail) => (
                  <tr>
                    <td>{iterationDetail.start_datetime}</td>
                    <td>{iterationDetail.start_datetime}</td>
                    <td></td>
                  </tr>
                ))}
                {/* <tr>
                <td>18-March-2024, 10:00 AM</td>
                <td>18-March-2024, 11:00 AM</td>
                <td>1 hr</td>
              </tr>
              <tr>
                <td>18-March-2024, 10:00 AM</td>
                <td>18-March-2024, 11:00 AM</td>
                <td>1 hr</td>
              </tr> */}
              </tbody>
            </table>
          </section>
        ) : null}
        <section className={styles["todo-danger-zone-section"]}>
          <h4>Danger Zone:</h4>
          <ul>
            <li className={styles["todo-danger-zone-control"]}>
              <div className={styles["todo-danger-control-description"]}>
                <strong>Mark this task as done:</strong>
                <div>
                  Once this task is marked as Done, there is no going back.
                </div>
              </div>
              <div>
                <button type="Submit">Done</button>
              </div>
            </li>
            <li className={styles["todo-danger-zone-control"]}>
              <div>
                <strong>Delete this task:</strong>
                <div>Once this task is deleted, there is no going back.</div>
              </div>
              <div>
                <button type="Submit">Delete this task</button>
              </div>
            </li>
          </ul>
        </section>
      </Card>
      {isEditing ? (
        <>
          <Backdrop />
          <TodoManager
            mode="edit"
            onCancel={handleCloseEditTask}
            onSave={handleTaskEdited}
          />
        </>
      ) : null}
    </>
  ) : (
    <p>Loading...</p>
  );
};
