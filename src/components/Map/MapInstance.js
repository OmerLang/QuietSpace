'use client'
import { Map, useMap } from "@vis.gl/react-google-maps"
import { useLocation } from "@/contexts/LocationContext";
import { isTypePlace } from "@/app/actions/isTypePlace";
import { fetchPoiCache } from "@/app/actions/fetchPoiCache";
import MarkerWithInfoWindow from "./Markers/MarkerWithInfoWindow/MarkerWithInfoWindow";
import { useEffect, useState, useCallback } from "react";




export default function MapInstance({ id, children, ...props }){

  const location = useLocation();
  const map = useMap(id);
  const [activePoi, setActivePoi] = useState(null);
  const [cachedPois, setCachedPois] = useState([]);

  const handleIdle = useCallback(async () => {
    if(!map) return;
    if (map.getZoom() < 15) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const searchArea = 
      {
        min_lat: sw.lat(),
        max_lat: ne.lat(),
        min_lng: sw.lng(),
        max_lng: ne.lng()
      };
    const data = await fetchPoiCache(searchArea);
    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        google_place_id: item.google_place_id,
        is_suitable: item.is_suitable,
        location: {
          lat: item.lat,
          lng: item.lng
        }
      }))
      setCachedPois((prev) => {
      const existingIds = new Set(prev.map(item => item.google_place_id));
      const newItems = formattedData.filter(item => !existingIds.has(item.google_place_id));
      if (newItems.length === 0) return prev;
      return [...prev, ...newItems];
    })
  }
}, [map]);


  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await isTypePlace('warmup-ping')
      } catch (e) {

      }
    };
    wakeUpServer();
  },[])

  useEffect(() => {
    if (!map || !location) {
      return;
    }
    map.panTo(location)
    map.setZoom(15);
  },[map, location])

  const onGooglePoiClick = useCallback(async (event) => {
    event.stop();
    const { detail } = event;
    console.log("Cache at time of click:", cachedPois);
    if (!detail.placeId) {
      return setActivePoi(null)
    }
    const cachedMatch = cachedPois?.find(p => p.google_place_id === detail.placeId);
    if (cachedMatch){
      // console.log("INSTANT HIT! No server call needed.");
      return setActivePoi(cachedMatch);
    }
    const place = await isTypePlace(detail.placeId);
    if (!place.is_suitable){
      setActivePoi(null);
    }
    else {
      setActivePoi((prev) => {
        if (prev?.placeId === place.google_place_id) return prev;
        return place;
      })
    }      
  },[cachedPois]);

  return (
    <Map
      id={id} 
      mapId={ id==="homepage-map" ? '8dcee7afbbbf8ac17e417c44' : '' }
      defaultCenter={{ lat: 32.07, lng: 34.78 }}
      reuseMaps={true}
      onClick={onGooglePoiClick}
      defaultZoom={11}
      minZoom={3}
      onIdle={handleIdle}
      restriction={{
      latLngBounds: {north: 33.8, south: 29, west: 33.5, east: 36.2},
      strictBounds: true,
      }}
      {...props}>
      {activePoi && 
        <MarkerWithInfoWindow
          activePoi={activePoi}
        />}
      {children}
    </Map>
  );
}