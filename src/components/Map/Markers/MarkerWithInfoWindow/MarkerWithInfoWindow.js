import { InfoWindow } from "@vis.gl/react-google-maps";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";




export default function MarkerWithInfoWindow({ position }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown),[]);

  const handleClose = useCallback(() => setInfoWindowShown(false), []);
  
  return (
    <>
      <AdvancedMarker
        position = { position }
        ref={markerRef}
        onClick={handleMarkerClick}>
          <div></div>
      </AdvancedMarker>

      {position && (
        <InfoWindow
          anchor={marker}
          pixelOffset={[0,-25]}
          onClose={handleClose}>  
          <p>info window text</p>          
        </InfoWindow>
      )}
    </>
  );
}