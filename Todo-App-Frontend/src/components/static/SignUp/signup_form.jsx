import { useState } from "react";
import styles from "./signup_form.module.css";

export function SignUp() {
  const [username, setUsername] = useState("");
  const [usernameErrMsg, setUsernameErrMsg] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState(false);

  const [email, setEmail] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordErrMsg, setPasswordErrMsg] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordErrMsg, setConfirmPasswordErrMsg] = useState("");
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);

  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const [isFormTouched, setIsFormTouched] = useState(false);

  const isFormFilled = hasSignupFormBeenFilled();

  return (
    <div className={styles["form-container"]}>
      <form>
        <div className={styles["form-header"]}>Signup</div>
        <div className={styles["form-body"]}>
          <div className={styles["form-control"]}>
            <label htmlFor="username"> Username </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              onChange={validUserName}
              value={username}
            />
            {usernameErrMsg ? (
              <div className={styles["error-msg"]}>{usernameErrMsg}</div>
            ) : null}
          </div>
          <div className={styles["form-control"]}>
            <label htmlFor="email"> Email </label>
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="off"
              onChange={validateEmail}
              value={email}
            />
            {emailErrMsg ? (
              <div className={styles["error-msg"]}>{emailErrMsg}</div>
            ) : null}
          </div>
          <div className={styles["form-control"]}>
            <label htmlFor="password"> Password </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="off"
              onChange={validPassword}
              value={password}
            />
            {passwordErrMsg ? (
              <div className={styles["error-msg"]}>{passwordErrMsg}</div>
            ) : null}
          </div>
          <div className={styles["form-control"]}>
            <label htmlFor="confirm-password"> Confirm Password </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="confirm-password"
              name="confirm-password"
              autoComplete="off"
              onChange={validConfirmPassword}
              value={confirmPassword}
            />
            {confirmPasswordErrMsg ? (
              <div className={styles["error-msg"]}>{confirmPasswordErrMsg}</div>
            ) : null}
          </div>
        </div>
        {!isFormFilled && isFormTouched ? (
          <div
            className={`${styles["error-msg"]} ${styles["form-invalid-msg"]}`}
          >
            Please fill all the details !
          </div>
        ) : null}
        <div className={styles["checkbox"]}>
          <input
            type="checkbox"
            id="check-password"
            name="check-password"
            onClick={() => setPasswordVisibility(!isPasswordVisible)}
          />
          <label>Show password</label>
        </div>

        <div className={styles["btn"]}>
          <input
            type="submit"
            onClick={handleOnSubmit}
            id="submit"
            name="submit-btn"
          />
        </div>
      </form>
    </div>
  );

  function validUserName(e) {
    const pattern = /^[a-zA-z][0-9a-zA-Z. ]+$/;
    let errMsg = "",
      valid = true;

    if (e.target.value === "") {
      errMsg = "Username is required!";
      valid = false;
    } else if (e.target.value.length < 4) {
      errMsg = "Username must be atleat 4 characters long!";
      valid = false;
    } else if (!pattern.test(e.target.value)) {
      errMsg = "Username should contain only a-z,A-Z,0-9, ,.";
      valid = false;
    }

    setUsername(e.target.value);
    setUsernameErrMsg(errMsg);
    setUsernameIsValid(valid);
  }

  function validPassword(e) {
    const pattern = /^[a-zA-z][0-9a-zA-Z. ]+$/;
    let errMsg = "",
      valid = true;

    if (e.target.value === "") {
      errMsg = "Password is required!";
      valid = false;
    } else if (e.target.value.length < 8) {
      errMsg = "Password must be atleat 8 characters long!";
      valid = false;
    } else if (!pattern.test(e.target.value)) {
      errMsg = "Password should contain only a-z,A-Z,0-9, ,.";
      valid = false;
    }

    setPassword(e.target.value);
    setPasswordErrMsg(errMsg);
    setPasswordIsValid(valid);
  }

  function validConfirmPassword(e) {
    let errMsg = "",
      valid = true;

    if (e.target.value === "") {
      errMsg = "Confirm password required";
      valid = false;
    } else if (e.target.value !== password) {
      errMsg = "Password not matching";
      valid = false;
    }

    setConfirmPassword(e.target.value);
    setConfirmPasswordErrMsg(errMsg);
    setConfirmPasswordIsValid(valid);
  }

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

  function hasSignupFormBeenFilled() {
    if (username === "") {
      return false;
    } else if (username === "") {
      return false;
    } else if (email === "") {
      return false;
    } else if (password === "") {
      return false;
    } else if (confirmPassword === "") {
      return false;
    } else {
      return true;
    }
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    setIsFormTouched(true);
    if (
      usernameIsValid &&
      emailIsValid &&
      passwordIsValid &&
      confirmPasswordIsValid
    ) {
      console.log("Submitting the form...");
      const response = await fetch("http://localhost:3001/users/signup", {
        method: "POST",
        body: JSON.stringify({
          user: { userName: username, password: password, emailId: email },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);

      if (data.add_user_status === "user_added") {
        // alert("User registered successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsFormTouched(false);
      } else if (data.add_user_status === "duplicate_email_id") {
        alert("This email id already exist!");
      }
    }
  }
}
