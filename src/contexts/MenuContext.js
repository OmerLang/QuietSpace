"use client";
import { useContext, createContext, useState } from "react";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInputActive, setSearchInputActive] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState("initial");
  const [lastOpen, setLastOpen] = useState(null);

  const openOverlay = (overlayName) => {
    setIsMenuOpen(false);
    setSearchInputActive(false);
    setActiveOverlay(overlayName);
    setLastOpen(overlayName);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const switchOverlay = (nextOverlayName) => {
    setIsMenuOpen(false);
    setSearchInputActive(false);
    setActiveOverlay(nextOverlayName);
    setTimeout(() => {
      setLastOpen(nextOverlayName);
    }, 200);
  };

  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        searchInputActive,
        setSearchInputActive,
        activeOverlay,
        openOverlay,
        closeOverlay,
        lastOpen,
        switchOverlay,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
