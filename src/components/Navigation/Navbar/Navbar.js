'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';


export default function Navbar() {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <nav className={styles.navbar}>
      <NavLink href="/">Logo</NavLink>
      <div className={styles.btnsWrapper}>
        {user && (
          <>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/settings">Settings</NavLink>
          <NavLink href="/favorites">Favorites</NavLink>
          </>
        )}
        <NavLink href="/about">About Us</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        <NavAuthButton></NavAuthButton>
      </div>
    </nav>
  )
}