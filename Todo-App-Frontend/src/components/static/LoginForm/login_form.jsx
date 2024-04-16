import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import styles from "./login_form.module.css";

import { useAuthContextData } from "../../../auth/AuthContext";
import { AuthService } from "../../../auth/AuthService";

export function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordErrMsg, setPasswordErrorMsg] = useState("");
  const [isPasswordValid, setPasswordValid] = useState(false);

  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const [isFormTouched, setFormTouched] = useState(false);

  const authContextData = useAuthContextData();
  const authService = new AuthService(authContextData);

  const navigate = useNavigate();

  console.log("Inside Login component");

  function validateEmail(e) {
    const pattern = /^[\w@#]{6,30}[.](com|in)$/;
    let errMsg = "",
      valid = true;

    if (e.target.value === "") {
      errMsg = "Email is required";
      valid = false;
    } else if (!pattern.test(e.target.value)) {
      errMsg = "Please enter a valid email(eg: name@company.com)";
      valid = false;
    }

    setEmail(e.target.value);
    setEmailErrMsg(errMsg);
    setEmailIsValid(valid);
  }

  const isFormFilled = hasFormBeenFilled();

  function validatePassword(e) {
    const pattern = /^[0-9a-zA-Z. ]+$/;

    setPassword(e.target.value);
    if (e.target.value === "") {
      setPasswordErrorMsg("Password is required!");
      setPasswordValid(false);
    } else if (!pattern.test(e.target.value)) {
      setPasswordErrorMsg("Password should contain only a-z, A-Z, 0-9, space, .");
      setPasswordValid(false);
    } else if (e.target.value.length < 8) {
      setPasswordErrorMsg("Password must be atleast 8 characters long!");
      setPasswordValid(false);
    } else {
      setPasswordErrorMsg("");
      setPasswordValid(true);
    }
  }

  function hasFormBeenFilled() {
    if (email === "") {
      return false;
    } else if (password === "") {
      return false;
    } else {
      return true;
    }
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    setFormTouched(true);
    // console.log(emailIsValid);
    // console.log(isPasswordValid);

    if (emailIsValid && isPasswordValid) {
      console.log("Submitting the form...");
      const user = { emailId: email, password: password };
      authService
        .login(user)
        .then((data) => {
          console.log(data);
          if (data.message === "user_logged_in") {
            console.log("Flag 1");
            setUser({
              userName: data.userName,
              userId: data.userId,
            });
            navigate("/todo-list");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div className={styles["login_container"]}>
      <form>
        <div className={styles["form-header"]}>Login</div>
        <div
          className={`${styles["form-control"]} ${styles["has-text-input"]}`}
        >
          <label htmlFor="email"> Email </label>
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="off"
            onChange={validateEmail}
          />
          {emailErrMsg ? (
            <div className={styles["error-msg"]}>{emailErrMsg}</div>
          ) : null}
        </div>
        <div
          className={`${styles["form-control"]} ${styles["has-text-input"]}`}
        >
          <label htmlFor="password">Password</label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="password"
            onChange={validatePassword}
            autoComplete="off"
          />
          <div className={styles["error-msg"]}>{passwordErrMsg}</div>
        </div>
        {!isFormFilled && isFormTouched ? (
          <div
            className={`${styles["error-msg"]} ${styles["form-invalid-msg"]}`}
          >
            Please fill all the details !
          </div>
        ) : null}
        <div
          className={`${styles["form-control"]} ${styles["has-checkbox-input"]}`}
        >
          <input
            type="checkbox"
            id="check-password"
            name="check-password"
            onClick={() => setPasswordVisibility(!isPasswordVisible)}
          />
          <label>Show password</label>
        </div>
        <div
          className={`${styles["form-control"]} ${styles["has-submit-input"]}`}
        >
          <input
            onClick={handleOnSubmit}
            id="submit"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
}
