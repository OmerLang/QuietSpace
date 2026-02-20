'use client'
import { Map, useMap } from "@vis.gl/react-google-maps"
import { useLocation } from "@/contexts/LocationContext";
import { isTypePlace } from "@/app/actions/isTypePlace";
import MarkerWithInfoWindow from "./Markers/MarkerWithInfoWindow/MarkerWithInfoWindow";
import { useEffect, useState, useCallback } from "react";




export default function MapInstance({ id, children, ...props }){

  const location = useLocation();
  const map = useMap(id);
  const [activePoi, setActivePoi] = useState(null);

  useEffect(() => {
    if (!map || !location) {
      return;
    }
    map.panTo(location)
    map.setZoom(14);
  },[map, location])

  const onGooglePoiClick = useCallback(async (event) => {
    event.stop();
    const { detail } = event;
    console.log(detail);
    if (!detail.placeId) {
      setActivePoi(null)
      return
    }
    const place = await isTypePlace(detail.placeId);
    if (!place){
      setActivePoi(null);
    }
    else {
      setActivePoi((prev) => {
        if (prev?.placeId === detail.placeId) return prev;
        return { placeId: detail.placeId, latLng: detail.latLng }
      })
    }      
  },[]);

  return (
    <Map
      id={id} 
      mapId={ id==="homepage-map" ? '8dcee7afbbbf8ac17e417c44' : '' }
      defaultCenter={{ lat: 32.07, lng: 34.78 }}
      reuseMaps={true}
      onClick={onGooglePoiClick}
      defaultZoom={11}
      minZoom={3}
      restriction={{
      latLngBounds: {north: 33.8, south: 29, west: 33.5, east: 36.2},
      strictBounds: true,
      }}
      {...props}>
      {activePoi && 
        <MarkerWithInfoWindow
          position={activePoi.latLng}
        />}
      {children}
    </Map>
  );
}