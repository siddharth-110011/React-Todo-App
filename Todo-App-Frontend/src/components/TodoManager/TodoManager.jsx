import { Card } from "../UI/Card/Card";
import styles from "./TodoManager.module.css";
import { Button } from "../UI/Button";
import { useState } from "react";

import {
  getFormattedDateTimeForDateTimeInput,
  getFormattedDateForBackend,
} from "../../utils/utility.js";

export function TodoManager(props) {
  console.log(props.deadline);

  const [todoName, setTodoName] = useState(props.todoName || "");
  const [todoType, setTodoType] = useState(props.todoType || "Daily Todo");
  const [deadline, setDeadline] = useState(
    props.deadline ? getFormattedDateTimeForDateTimeInput(props.deadline) : null
  );
  const [todoPriority, setTodoPriority] = useState(props.priority || "Medium");
  const [todoDescription, setTodoDescription] = useState(
    props.todoDescription || ""
  );

  console.log(deadline);

  const [todoNameErrorMsg, setTodoNameErrorMsg] = useState("");
  const [isTodoNameValid, setIsTodoNameValid] = useState(false);

  const [isFormTouched, setIsFormTouched] = useState(false);
  const isFormFilled = hasFormBeenFilled();

  function handleTodoName(e) {
    let pattern = /^[a-zA-Z0-9. ]+$/;
    setTodoName(e.target.value);
    if (e.target.value == "") {
      setTodoNameErrorMsg("Todo name is required!");
      setIsTodoNameValid(false);
    } else if (!pattern.test(e.target.value)) {
      setIsTodoNameValid(false);
      setTodoNameErrorMsg(
        "Todo name should contain only only a-z, A-Z, 0-9, space, ."
      );
    } else if (e.target.value.length < 2 || e.target.value.length > 25) {
      setIsTodoNameValid(false);
      setTodoNameErrorMsg(
        "Todo name should have atleast 2 characters and a maximum of 30!"
      );
    } else {
      setIsTodoNameValid(true);

      setTodoNameErrorMsg("");
    }
  }

  function handleTodoType(e) {
    setTodoType(e.target.value);
  }

  function handleTodoDeadline(e) {
    let dateTime = isNaN(new Date(e.target.value))
      ? null
      : getFormattedDateForBackend(e.target.value);
    setDeadline(dateTime);
  }

  function handleTodoPriority(e) {
    setTodoPriority(e.target.value);
  }

  function handleTodoDescription(e) {
    setTodoDescription(e.target.value);
  }

  function hasFormBeenFilled() {
    if (todoName === "") {
      return false;
    } else {
      return true;
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    setIsFormTouched(true);

    if (isTodoNameValid) {
      const todo = {
        todoName: todoName,
        todoType: todoType,
        priority: todoPriority,
        todoStatus: "Not Started",
        deadline: todoDeadline,
        todoDescription: todoDescription,
      };
      props.onAdd(todo);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const todo = {
      todoName: todoName,
      todoType: todoType,
      priority: todoPriority,
      todoStatus: "Not Started",
      deadline: deadline,
      todoDescription: todoDescription,
    };
    props.onSave(todo);
  }

  const actionBtn =
    props.mode === "add" ? (
      <Button type="Submit" value="Add" onClick={handleAdd} />
    ) : (
      <Button type="Submit" value="Save" onClick={handleSave} />
    );

  return (
    <Card className={styles["todo-manager-container"]}>
      <form>
        <div className={styles["form-header"]}>
          {props.mode === "add" ? "Add" : "Edit"} Todo
        </div>
        <div className={styles["form-body"]}>
          <div className={styles["form-control"]}>
            <label>
              <span>Todo Name:</span>
              <input
                type="text"
                value={todoName}
                required
                onChange={handleTodoName}
              />
              {!isTodoNameValid && isFormTouched ? (
                <div className={styles["error-msg"]}>{todoNameErrorMsg}</div>
              ) : null}
            </label>
          </div>
          <div className={styles["form-control"]}>
            <label>
              <span>Todo type:</span>
              <select onChange={handleTodoType} value={todoType}>
                <option value="Daily Todo">Daily Todo</option>
                <option value="Project Specific">Project Specific</option>
                <option value="Others">Others</option>
              </select>
            </label>
          </div>
          <div className={styles["form-control"]}>
            <label>
              <span>Deadline:</span>
              <input
                type="datetime-local"
                value={deadline || "NA"}
                min={new Date().toISOString().split("T")[0]}
                disabled={todoType === "Daily Todo" ? true : false}
                onChange={handleTodoDeadline}
              />
            </label>
          </div>
          <div className={styles["form-control"]}>
            <label>
              <span>Todo priority:</span>
              <select onChange={handleTodoPriority} value={todoPriority}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
          </div>
          <div
            className={`${styles["form-control"]} ${styles["todo-description-container"]}`}
          >
            <label>
              <span>Todo Description:</span>
              <textarea
                value={todoDescription}
                onChange={handleTodoDescription}
              ></textarea>
            </label>
          </div>
        </div>
        <div className={styles["form-footer"]}>
          {!isFormFilled && isFormTouched ? (
            <div
              className={`${styles["error-msg"]} ${styles["form-error-container"]} `}
            >
              Please fill all the details!
            </div>
          ) : null}
          <Button value="Cancel" onClick={props.onCancel} />
          {actionBtn}
        </div>
      </form>
    </Card>
  );
}
