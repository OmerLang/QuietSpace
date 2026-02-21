import { InfoWindow } from "@vis.gl/react-google-maps";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { memo, useCallback } from "react";
import { useState } from "react";

const MarkerWithInfoWindow = memo(function MarkerWithInfoWindow({ position }) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        position = { position }
        ref={markerRef}>
          <div></div>
      </AdvancedMarker>

      {position && (
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