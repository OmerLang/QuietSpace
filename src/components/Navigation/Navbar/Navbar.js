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

  if (loading) return null;

  return (
    <nav className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <NavLink className={styles.logo} href="/">Logo</NavLink>
        <button type='button' className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
        <div className={`${isOpen ? styles.overlay : ""}`} onClick={isOpen ? toggleMenu : null}></div>
        <div className={`${styles.navLinks} ${isOpen ? styles.navLinksActive : ""}`}>
          <NavAuthButton></NavAuthButton>
          {user ? (
            <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/settings">Settings</NavLink>
            <NavLink href="/favorites">Favorites</NavLink>
            </>
          ) : (
            <NavLink href="/signup">Sign-Up</NavLink>
          )}
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  )
}