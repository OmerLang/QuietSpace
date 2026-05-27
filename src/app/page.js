import styles from "./page.module.css";
import MapInstance from "@/components/Map/MapInstance";

export default function Home() {
  return (
    <>
      <div className={styles.mapDiv}>
        <MapInstance
          id={"homepage-map"}
          style={{ width: "100dvw", height: "100dvh" }}
          gestureHandling="greedy"
          disableDefaultUI
        ></MapInstance>
      </div>
    </>
  );
}
