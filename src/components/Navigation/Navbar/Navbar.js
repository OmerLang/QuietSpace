'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';
import { useMenu } from '@/contexts/MenuContext';


export default function Navbar() {
  const { user, loading } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
      <div className={styles.container}>
        <button
          onClick={toggleMenu}
          className={styles.menuBtn}>
          <span className={isMenuOpen ? styles.firstLine : ""}></span>
          <span className={isMenuOpen ? styles.middleLine : ""}></span>
          <span className={isMenuOpen ? styles.thirdLine : ""}></span>
        </button>
        <div className={`${styles.innerContainer} ${isMenuOpen ? styles.show : styles.hide}`}>
          <NavLink
            href="/about"
            className={`${styles.button} ${isMenuOpen && styles.buttonShow}`}>
            About
          </NavLink>
          <span className={styles.spacer}></span>
          <NavAuthButton
          onClick={toggleMenu}
          className={`${styles.button} ${isMenuOpen && styles.buttonShow}`}        
          />
          <span className={styles.spacer}></span>
          <NavLink
            href={user ? "/profile" : "/signup"}
            className={`${styles.button} ${isMenuOpen && styles.buttonShow}`}>
            {user ? "Profile" : "Signup"}
          </NavLink>
        </div>
      </div>
  )
}
