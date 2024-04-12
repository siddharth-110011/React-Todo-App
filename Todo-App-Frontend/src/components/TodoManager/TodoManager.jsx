import { Card } from "../UI/Card/Card";
import styles from "./TodoManager.module.css";
import { Button } from "../UI/Button";
import { useState } from "react";

export function TodoManager(props) {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("Daily Task");
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDescription, setTaskDescription] = useState("");

  const [taskNamErrMsg, setTaskNameErrorMsg] = useState("");
  const [isTaskNameValid, setIsTaskNameValid] = useState(false);

  const [isFormTouched, setIsFormTouched] = useState(false);
  const isFormFilled = hasFormBeenFilled();

  function handleTaskName(e) {
    let pattern = /^[a-zA-Z0-9. ]+$/;
    setTaskName(e.target.value);
    if (e.target.value == "") {
      setTaskNameErrorMsg("Task name is required!");
      setIsTaskNameValid(false);
    } else if (!pattern.test(e.target.value)) {
      setIsTaskNameValid(false);
      setTaskNameErrorMsg(
        "Task name should contain only only a-z, A-Z, 0-9, space, ."
      );
    } else if (e.target.value.length < 2 || e.target.value.length > 25) {
      setIsTaskNameValid(false);
      setTaskNameErrorMsg(
        "Task name should have atleast 2 characters and a maximum of 30!"
      );
    } else {
      setIsTaskNameValid(true);

      setTaskNameErrorMsg("");
    }
  }

  function handleTaskType(e) {
    setTaskType(e.target.value);
  }

  function handleTaskDeadline(e) {
    const date = new Date(e.target.value);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedDate = `${day}-${monthNames[monthIndex]}-${year}`;
    console.log(formattedDate);
    setTaskDeadline(formattedDate);
  }

  function handleTaskPriority(e) {
    setTaskPriority(e.target.value);
  }

  function handleTaskDescription(e) {
    setTaskDescription(e.target.value);
  }

  function hasFormBeenFilled() {
    if (taskName === "") {
      return false;
    } else {
      return true;
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    setIsFormTouched(true);

    if (isTaskNameValid) {
      const task = {
        todoName: taskName,
        todoType: taskType,
        priority: taskPriority,
        todoStatus: "Not Started",
        deadline: taskDeadline,
        todoDescription: taskDescription,
      };
      props.onAdd(task);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const task = {
      taskName: taskName,
      taskType: taskType,
      priority: taskPriority,
      status: "Not Started",
      deadLine: taskDeadline,
      taskDescription: taskDescription,
    };
    props.onSave(task);
  }

  const actionBtn =
    props.mode === "add" ? (
      <Button type="Submit" value="Add" onClick={handleAdd} />
    ) : (
      <Button type="Submit" value="Save" onClick={handleSave} />
    );

  return (
    <Card className={styles["add-task-container"]}>
      <form onSubmit={handleAdd}>
        <div className={styles["form-header"]}>
          {props.mode === "add" ? "Add" : "Edit"} Task
        </div>
        <div className={styles["form-body"]}>
          <div className={styles["form-control"]}>
            <label>
              <span>Task Name:</span>
              <input type="text" required onChange={handleTaskName} />
              {!isTaskNameValid && isFormTouched ? (
                <div className={styles["error-msg"]}>{taskNamErrMsg}</div>
              ) : null}
            </label>
          </div>
          <div className={styles["form-control"]}>
            <label>
              <span>Task type:</span>
              <select onChange={handleTaskType} value={taskType}>
                <option value="Daily Task">Daily Task</option>
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
                min={new Date().toISOString().split("T")[0]}
                disabled={taskType === "Daily Task" ? true : false}
                onChange={handleTaskDeadline}
              />
            </label>
          </div>
          <div className={styles["form-control"]}>
            <label>
              <span>Task priority:</span>
              <select onChange={handleTaskPriority} value={taskPriority}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
          </div>
          <div
            className={`${styles["form-control"]} ${styles["task-description-container"]}`}
          >
            <label>
              <span>Task Description:</span>
              <textarea onChange={handleTaskDescription}></textarea>
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
