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
  const [ratedPoisIds, setRatedPoisIds] = useState(new Set());
  


  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setRatedPoisIds(new Set());
        return;
      }
      const { data, error } = await supabase
      .from('ratings')
      .select('google_place_id')
      .eq('user_id',user.id);

      if (error)
        return console.log("user ratings fetch error:", error);

      if (data) {
        const idSet = new Set(data.map(item => item.google_place_id))
        setRatedPoisIds(idSet)
      }
    }
    fetchData();

  }, [user])

  return (
    <cachedPoisContext.Provider value={{ activePoi, setActivePoi, cachedPois, setCachedPois, ratedPoisIds, setRatedPoisIds}}>
      {children}
    </cachedPoisContext.Provider>
  )
}

export const usePois = () => useContext(cachedPoisContext);
