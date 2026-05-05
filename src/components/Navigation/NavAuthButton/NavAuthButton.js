'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './NavAuthButton.module.css';

export default function NavAuthButton({ onClick, className, style }) {
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClick();
  }

  if (loading) return <div className={styles.loading}></div>;

  return (
    user ? (<button type="button" style={style} className={className ? className : ""} onClick={handleLogout}>Logout</button>) : (<Link style={style} className={className ? className : ""} onClick={onClick} href="/login">Login</Link>)
  )
}

