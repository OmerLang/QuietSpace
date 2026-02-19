'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';


export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);
  const isMobile = useIsMobile((state) => state.isMobile)
  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(false);
    setDisableTransition(true)

    const time = setTimeout(() => {
      setDisableTransition(false)
    },50);
    return () => clearTimeout(time);
  },[isMobile]);

  if (loading) return null;

  return (
    <nav className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <NavLink className={styles.logo} href="/">QuiteSpace</NavLink>
        {isMobile && (
          <button type='button' className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`} onClick={toggleMenu}>
            <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
            <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
            <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
          </button>
        )}
        {isMobile && <div className={`${isOpen ? styles.overlay : ""}`} onClick={isOpen ? toggleMenu : null}></div>}
        <div className={`${styles.navLinks} ${isOpen ? styles.navLinksActive : ""} ${disableTransition ? styles.noTransition : ""}`}>
          <NavAuthButton className={`${isOpen && styles.link}`} onClick={closeMenu}></NavAuthButton>
          {user ? (
            <>
            <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/dashboard">Dashboard</NavLink>
            <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/settings">Settings</NavLink>
            <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/favorites">Favorites</NavLink>
            </>
          ) : (
            <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/signup">Sign-Up</NavLink>
          )}
          <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/about">About Us</NavLink>
          <NavLink className={isOpen ? styles.link : ""} onClick={closeMenu} href="/contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  )
}