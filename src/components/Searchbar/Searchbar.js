"use client";

import { useState, useEffect } from "react";
import { fetchImageToPoi, handleSearch } from "@/app/actions/handleSearch";
import styles from "./Searchbar.module.css";
import { useLocation } from "@/contexts/LocationContext";
import { usePois } from "@/contexts/PoisContext";
import { useMenu } from "@/contexts/MenuContext";

export const Searchbar = () => {
  const userLocation = useLocation();
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { activePoi, setActivePoi, setCachedPois } = usePois();
  const { searchInputActive, setSearchInputActive, closeOverlay } = useMenu();

  const lat = userLocation?.lat ?? 32.0853;
  const lng = userLocation?.lng ?? 34.7818;

  const handleSearchClick = async (poi) => {
    if (!poi.is_suitable) {
      return;
    }
    setSearchInputActive(false);
    const targetPoi = poi.photo_url === null ? await fetchImageToPoi(poi) : poi;
    setCachedPois((prev) => {
      const alreadyInCache = prev.some(
        (place) => place.google_place_id === targetPoi.google_place_id,
      );
      if (!alreadyInCache) {
        return [...prev, targetPoi];
      }
      return prev;
    });
    setActivePoi(targetPoi);
    setSearchInputActive(false);
  };

  useEffect(() => {
    let isCurrentRequest = true;
    if (!input || input.trim().length === 0) {
      setSearchResults([]);
      setSearchInputActive(false);
      return;
    }

    const timerId = setTimeout(async () => {
      try {
        const currentResultsArr = await handleSearch(input, lat, lng);

        // Only update state if no other keystroke has happened since this request fired
        if (isCurrentRequest) {
          setSearchResults(currentResultsArr || []);
          setSearchInputActive(true);
        }
      } catch (err) {
        console.error("Search execution failure:", err);
      }
    }, 350);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timerId);
    };
  }, [input, lat, lng, setSearchInputActive]);

  useEffect(() => {
    console.log("current active poi search click:", activePoi);
  }, [activePoi]);

  useEffect(() => {
    if (searchResults.length < 1) {
      setSearchInputActive(false);
    }
    console.log("search results:", searchResults);
  }, [searchResults]);

  const handleOverlay = () => {
    setSearchInputActive(true);
    closeOverlay();
  };

  return (
    <div
      className={`${styles.searchContainer} ${searchInputActive ? styles.searchContainerActive : ""}`}
    >
      <input
        className={`${styles.input} ${searchInputActive ? styles.inputActive : ""}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onClick={() => {
          searchResults.length > 0 && searchResults ? handleOverlay() : null;
        }}
        placeholder="חיפוש..."
      />
      {searchResults && searchResults.length > 0 && searchInputActive && (
        <div className={styles.searchResults}>
          {searchResults.map((searchResult) => (
            <button
              key={searchResult.google_place_id}
              onClick={() => handleSearchClick(searchResult)}
              className={styles.resultButton}
            >
              <span className={styles.displayName}>
                {searchResult.display_name}
              </span>
              <span className={styles.address}>
                {searchResult?.address || ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
