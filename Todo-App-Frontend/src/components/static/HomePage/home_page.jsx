import styles from "./home_page.module.css";
import ReactPlayer from "react-player";

export function HomePage() {
  return (
    <>
      <h1 className={styles["heading"]}>Todo List</h1>
      <ReactPlayer  className={styles["videos1"]}
        playing= {true}
        muted= {true}
        width="400px"
        height="300px"
        url= "video/videos1.mp4"
        controls ={true}
      />
    </>
  );
}
