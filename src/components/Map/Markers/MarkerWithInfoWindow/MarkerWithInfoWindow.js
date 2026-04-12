import { InfoWindow } from "@vis.gl/react-google-maps";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { memo } from "react";

const MarkerWithInfoWindow = memo(function MarkerWithInfoWindow({ activePoi }) {
  const [markerRef, marker] = useAdvancedMarkerRef();


  return (
    <>
      <AdvancedMarker
        position = { activePoi.location }
        ref={markerRef}>
          <div></div>
      </AdvancedMarker>

      {activePoi && (
        <InfoWindow
          anchor={marker}
          headerDisabled={true}
          pixelOffset={[0,-25]}>
          <p>info window text</p>          
        </InfoWindow>
      )}
    </>
  );
});

export default MarkerWithInfoWindow;