'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './NavAuthButton.module.css';

export default function NavAuthButton() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className={styles.loading}></div>;

  return (
    user ? (<button type="button" className={styles.button} onClick={logout}>Logout</button>) : (<Link className={styles.button} href="/login">Login</Link>)
  )
}

