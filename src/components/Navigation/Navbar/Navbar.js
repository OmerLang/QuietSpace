'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';
import { useState } from 'react';


export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  if (loading) return null;

  return (
    <nav className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <NavLink className={styles.logo} href="/">QuiteSpace</NavLink>
        <button type='button' className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`} onClick={toggleMenu}>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen : ""}`}></span>
        </button>
        <div className={`${isOpen ? styles.overlay : ""}`} onClick={isOpen ? toggleMenu : null}></div>
        <div className={`${styles.navLinks} ${isOpen ? styles.navLinksActive : ""}`}>
          <NavAuthButton className={`${isOpen && styles.link}`} onClick={closeMenu}></NavAuthButton>
          {user ? (
            <>
            <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/dashboard">Dashboard</NavLink>
            <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/settings">Settings</NavLink>
            <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/favorites">Favorites</NavLink>
            </>
          ) : (
            <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/signup">Sign-Up</NavLink>
          )}
          <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/about">About Us</NavLink>
          <NavLink className={`${isOpen && styles.link}`} onClick={closeMenu} href="/contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  )
}