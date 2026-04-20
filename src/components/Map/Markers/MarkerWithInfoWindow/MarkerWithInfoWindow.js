import { InfoWindow } from "@vis.gl/react-google-maps";
import { useMap, AdvancedMarker, useAdvancedMarkerRef, CollisionBehavior } from "@vis.gl/react-google-maps";
import { act, memo, useEffect, useState } from "react";
import PoiInfoWindow from "../PoiInfoWindow/PoiInfoWindow";
import { usePois } from "@/contexts/PoisContext";
import styles from "./MarkerWithInfoWindow.module.css"

 const zoomTable = {
    12: styles.zoom_12,
    13: styles.zoom_13,
    14: styles.zoom_14,
    15: styles.zoom_15
  }


const MarkerWithInfoWindow = memo(function MarkerWithInfoWindow() {
  const map = useMap();
  const [zoom, setZoom] = useState(12);
  const [activeMarkerRef, activeMarker] = useAdvancedMarkerRef();
  const { activePoi, setActivePoi, cachedPois, } = usePois();
  
  const setAsActive = (poi) => {
    setActivePoi(poi)
  }

  useEffect (() => {
    if (!map) return;
    const listener = map.addListener("zoom_changed", () => {
      setZoom(map.getZoom())
    })
    setZoom(map.getZoom());
    return () => listener.remove();
  },[map])

  return (
    <>
      {cachedPois?.map((poi) => (
        <AdvancedMarker
        collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
        key={poi.google_place_id}
        onClick={() => setAsActive(poi)}
        position = { poi.location }
        ref={poi.google_place_id === activePoi?.google_place_id ? activeMarkerRef : null}>
        <div className={zoom > 15 ? styles.maxZoom : (zoomTable[Math.floor(zoom)] || styles.zoom_12)}>{poi.is_quiet_space ? "quite_space" : "" }</div>
      </AdvancedMarker>
      ))}

      {activePoi && activeMarker && (
        <InfoWindow
          key={activePoi.google_place_id}
          anchor={activeMarker}
          headerDisabled={true}
          pixelOffset={[0,-25]}>
        <PoiInfoWindow/>
        </InfoWindow>
      )}
    </>
  );
},);

export default MarkerWithInfoWindow;