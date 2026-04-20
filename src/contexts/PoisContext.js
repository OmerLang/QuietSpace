'use client'
import { createContext, useContext, useState } from "react";

const cachedPoisContext = createContext({});

export const PoisProvider = ({ children }) => {
  
  const [activePoi, setActivePoi] = useState(null);
  const [cachedPois, setCachedPois] = useState([]);
  const [displayPois, setDisplayPois] = useState([]);
  
  return (
    <cachedPoisContext.Provider value={{ activePoi, setActivePoi, cachedPois, setCachedPois, }}>
      {children}
    </cachedPoisContext.Provider>
  )
}

export const usePois = () => useContext(cachedPoisContext);
