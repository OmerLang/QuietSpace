'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/utils/supabase/client";

const cachedPoisContext = createContext({});

export const PoisProvider = ({ children }) => {

  const supabase = createClient();

  const { user } = useAuth();
  const [activePoi, setActivePoi] = useState(null);
  const [cachedPois, setCachedPois] = useState([]);
  const [ratedPois, setRatedPois] = useState(new Map());
  


  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setRatedPois(new Map());
        return;
      }
      const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('user_id',user.id)

      if (error)
        return console.log("user ratings fetch error:", error);

      if (data) {
        console.log("raw data:", data)
        const idMap = new Map(data.map(item => [item.google_place_id, item]))
        console.log("idMap:", idMap);
        setRatedPois(idMap)
      }
    }
    fetchData();

  },[user,activePoi])

  return (
    <cachedPoisContext.Provider value={{ activePoi, setActivePoi, cachedPois, setCachedPois, ratedPois, setRatedPois}}>
      {children}
    </cachedPoisContext.Provider>
  )
}

export const usePois = () => useContext(cachedPoisContext);
