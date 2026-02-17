'use client'
import { useContext, createContext, useState, useEffect } from "react";


const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude});
      console.log(position)
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    )
  },[])

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext);