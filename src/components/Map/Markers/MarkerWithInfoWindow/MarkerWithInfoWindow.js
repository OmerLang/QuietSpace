import { InfoWindow } from "@vis.gl/react-google-maps";
import { useMap, AdvancedMarker, useAdvancedMarkerRef, CollisionBehavior } from "@vis.gl/react-google-maps";
import { memo, useEffect, useState } from "react";
import PoiInfoWindow from "../PoiInfoWindow/PoiInfoWindow";
import QuietSpacePin from "../QuietSpacePin/QuietSpacePin";
import { usePois } from "@/contexts/PoisContext";


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
        zIndex={1000}
        ref={poi.google_place_id === activePoi?.google_place_id ? activeMarkerRef : null}>
        {poi.is_quiet_space && zoom >=12 && <QuietSpacePin total_rating={poi.total_rating} google_place_id={poi.google_place_id}/>}
      </AdvancedMarker>
      ))}

      {activePoi && activeMarker && (
        <InfoWindow
          key={`${activePoi.google_place_id}-${activeMarker.location?.lat}`}
          anchor={activeMarker}
          headerDisabled={true}
          pixelOffset={activePoi?.is_quiet_space ? [0,0] : [0,-25]}>
        <PoiInfoWindow/>
        </InfoWindow>
      )}
    </>
  );
},);

export default MarkerWithInfoWindow;