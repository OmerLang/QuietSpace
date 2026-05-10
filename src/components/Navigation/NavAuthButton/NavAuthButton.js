'use client';
import { useAuth } from '@/contexts/AuthContext';
import styles from './NavAuthButton.module.css';

export default function NavAuthButton({ onClick, className, style, textClassName }) {
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClick();
  }

  if (loading) return <div className={styles.loading}></div>;

  return (
    user ? (
            <button 
              type="button"
              style={style}
              className={className ? className : ""}
              onClick={handleLogout}
              >
              <span className={textClassName}>Logout</span>
            </button>
            ) : (
            <button 
              style={style}
              className={className ? className : ""}
              onClick={onClick}
              >
              <span className={textClassName}>Login</span>
            </button>)
  )
}

