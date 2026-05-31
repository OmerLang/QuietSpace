"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { handleSearch } from "@/app/actions/handleSearch";
import styles from "./Searchbar.module.css";
import { useLocation } from "@/contexts/LocationContext";

export const Searchbar = () => {
  const userLocation = useLocation();
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const activeTimerId = useRef(null);

  const lat = userLocation?.lat ?? 32.0853;
  const lng = userLocation?.lng ?? 34.7818;

  const handleChange = (input) => {
    setInput(input);
    if (input && input.trim().length > 0) {
      debouncedSearch(input, lat, lng);
    }
  };

  const debouncedSearch = useCallback((searchTerm, lat, lng) => {
    if (activeTimerId.current !== null) {
      clearTimeout(activeTimerId.current);
    }
    activeTimerId.current = setTimeout(async () => {
      const currentResultsArr = await handleSearch(searchTerm, lat, lng);
      setSearchResults(currentResultsArr);
    }, 350);
  }, []);

  useEffect(() => {
    console.log("search results:", searchResults);
  }, [searchResults]);

  return (
    <input
      className={styles.input}
      value={input}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search a place..."
    />
  );
};
