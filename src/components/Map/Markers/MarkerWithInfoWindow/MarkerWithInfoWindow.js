import Marker from "../Marker/Marker";
import { InfoWindow } from "@vis.gl/react-google-maps";
import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";




export default function MarkerWithInfoWindow({ position }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown),[]);

  const handleClose = useCallback(() => setInfoWindowShown(false), []);
  
  return (
    <>
      <Marker
        position={position}
        markerRef={markerRef}
        handleMarkerClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}>  
          <p>info window text</p>          
        </InfoWindow>
      )}
    </>
  );
}