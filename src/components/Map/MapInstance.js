"use client";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useLocation } from "@/contexts/LocationContext";
import { isTypePlace } from "@/app/actions/isTypePlace";
import {
  fetchPoiCache,
  getQuietSpacesByZoom,
} from "@/app/actions/fetchPoiCache";
import { usePois } from "@/contexts/PoisContext";
import MarkerWithInfoWindow from "./Markers/MarkerWithInfoWindow/MarkerWithInfoWindow";
import { useEffect, useCallback } from "react";
import { useMenu } from "@/contexts/MenuContext";
import { useTheme } from "next-themes";

export default function MapInstance({ id, children, ...props }) {
  const location = useLocation();
  const map = useMap(id);
  const { setActivePoi, cachedPois, setCachedPois } = usePois();
  const { setIsMenuOpen } = useMenu();
  const { theme } = useTheme();

  const handleIdle = useCallback(async () => {
    if (!map) return;
    const zoom = Math.floor(map.getZoom());
    if (zoom < 12) {
      return;
    }
    console.log("zoom:", zoom);
    const bounds = map.getBounds();
    if (!bounds) return;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const searchArea = {
      min_lat: sw.lat(),
      max_lat: ne.lat(),
      min_lng: sw.lng(),
      max_lng: ne.lng(),
    };

    let data = [];
    if (zoom >= 16) data = await fetchPoiCache(searchArea);
    else {
      const gridSizes = { 12: 0.05, 13: 0.02, 14: 0.01, 15: 0.005 };
      const gridSize = gridSizes[zoom];
      console.log("size:", gridSize);
      data = await getQuietSpacesByZoom({
        ...searchArea,
        grid_size_degrees: gridSize,
      });
    }

    console.log("the Data:", data);
    if (data && data.length > 0) {
      const formattedData = data.map(({ lat, lng, ...rest }) => ({
        ...rest,
        is_suitable: true,
        location: { lat, lng },
      }));
      setCachedPois((prev) => {
        const existingIds = new Set(prev.map((item) => item.google_place_id));
        const newItems = formattedData.filter(
          (item) => !existingIds.has(item.google_place_id),
        );
        if (newItems.length === 0) return prev;
        return [...prev, ...newItems];
      });
    }
  }, [map]);

  useEffect(() => {
    console.log("currently in cache:", cachedPois);
    console.table(cachedPois);
  }, [cachedPois]);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await isTypePlace("warmup-ping");
      } catch (e) {}
    };
    wakeUpServer();
  }, [map]);

  useEffect(() => {
    if (!map || !location) {
      return;
    }
    map.panTo(location);
    map.setZoom(15);
  }, [map, location]);

  const onGooglePoiClick = useCallback(async (event) => {
    event.stop();
    setIsMenuOpen(false);
    const { detail } = event;
    if (!detail.placeId) {
      return setActivePoi(null);
    }
    let alreadyCached = false;
    setCachedPois((prev) => {
      const cachedMatch = prev.find(
        (poi) => poi.google_place_id === detail.placeId,
      );
      if (cachedMatch) {
        alreadyCached = true;
        setActivePoi(cachedMatch);
      }
      return prev;
    });
    if (!alreadyCached) {
      const place = await isTypePlace(detail.placeId);
      if (!place.is_suitable) {
        setActivePoi(null);
      } else {
        setActivePoi((prev) => {
          if (prev?.placeId === place.google_place_id) return prev;
          return place;
        });
        setCachedPois((prev) => {
          const poiInCache = prev.some(
            (poi) => poi.google_place_id === place.google_place_id,
          );
          if (poiInCache) return prev;
          return [...prev, place];
        });
      }
    }
  }, []);

  return (
    <Map
      id={id}
      mapId={id === "homepage-map" ? "8dcee7afbbbf8ac17e417c44" : ""}
      defaultCenter={{ lat: 32.07, lng: 34.78 }}
      reuseMaps={true}
      onClick={onGooglePoiClick}
      defaultZoom={11}
      colorScheme={theme === "dark" ? "DARK" : "LIGHT"}
      minZoom={3}
      onIdle={handleIdle}
      onDrag={() => setIsMenuOpen(false)}
      restriction={{
        latLngBounds: { north: 33.8, south: 29, west: 33.5, east: 36.2 },
        strictBounds: true,
      }}
      {...props}
    >
      {<MarkerWithInfoWindow />}
      {children}
    </Map>
  );
}
