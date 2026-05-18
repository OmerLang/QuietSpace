'use client'
import { useContext, createContext, useState } from "react";



const MenuContext = createContext();

export function MenuProvider ({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(null);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(null);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, isLoginPopupOpen, setIsLoginPopupOpen, isSignupPopupOpen, setIsSignupPopupOpen, isAboutOpen, setIsAboutOpen }}>
      {children}
    </MenuContext.Provider>
  )

}

export const useMenu = () => useContext(MenuContext)
