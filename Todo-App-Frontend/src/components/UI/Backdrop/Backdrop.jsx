import styles from "./Backdrop.module.css";

export function Backdrop() {

    function handleOnClick(e) {
        e.target.style.display="none";
    }

    return (
        <div className={styles["backdrop"]}></div>
    )
}