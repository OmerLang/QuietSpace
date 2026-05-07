'use client'
import { useContext, createContext, useState } from "react";



const MenuContext = createContext();

export function MenuProvider ({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, isLoginPopupOpen, setIsLoginPopupOpen }}>
      {children}
    </MenuContext.Provider>
  )

}

export const useMenu = () => useContext(MenuContext)
