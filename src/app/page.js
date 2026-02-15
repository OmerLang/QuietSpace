import styles from "./page.module.css";
import MapWrapper from "@/components/Map/MapWrapper";
import MapInstance from "@/components/Map/MapInstance";

export default function Home() {
  return (
    <>
      <div>Home page map</div>
      <MapWrapper>
        <MapInstance></MapInstance>
      </MapWrapper>
    </>
  )
}
