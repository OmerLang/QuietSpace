'use client'
import { Map, useMap } from "@vis.gl/react-google-maps"
import { useLocation } from "@/contexts/LocationContext";
import { useEffect } from "react";




export default function MapInstance({ id, children, ...props }){

  const location = useLocation();
  const map = useMap(id);

  useEffect(() => {
    if (!map || !location) {
      return;
    }
    map.panTo(location)
    map.setZoom(14);
  },[map, location])
 

  return (
    <Map
      id={id} 
      mapId={ id==="homepage-map" ? '8dcee7afbbbf8ac17e417c44' : '' }
      defaultCenter={{ lat: 32.07, lng: 34.78 }}
      reuseMaps={true}
      defaultZoom={11}
      minZoom={3}
      restriction={{
      latLngBounds: {north: 33.8, south: 29, west: 33.5, east: 36.2},
      strictBounds: true,
      }}
      {...props}>
      {children}
    </Map>
  );
}