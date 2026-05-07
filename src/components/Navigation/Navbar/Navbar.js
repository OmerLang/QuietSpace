'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';
import { useMenu } from '@/contexts/MenuContext';
import LoginPopup from '@/components/LoginPopup/LoginPopup';


export default function Navbar() {
  const { user, loading } = useAuth();
  const { isMenuOpen, setIsMenuOpen, isLoginPopupOpen, setIsLoginPopupOpen } = useMenu();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLoginPopup = () => {
    setIsMenuOpen(false);
    setIsLoginPopupOpen(!isLoginPopupOpen)
  }


  return (
    <>
        <div className={styles.navbarContainer}>
          <button
            onClick={toggleMenu}
            className={styles.menuBtn}>
            <span className={isMenuOpen ? styles.firstLine : ""}></span>
            <span className={isMenuOpen ? styles.middleLine : ""}></span>
            <span className={isMenuOpen ? styles.thirdLine : ""}></span>
          </button>
          <div className={`${styles.innerContainer} ${isMenuOpen ? styles.show : ""}`}>
            <NavLink
              href="/about"
              className={`${styles.button} ${isMenuOpen && styles.buttonShow}`}>
              <span className={styles.btnText}>About</span>
            </NavLink>
            <span className={styles.spacer}></span>
            <NavAuthButton
              onClick={toggleLoginPopup}
              className={`${styles.button} ${isMenuOpen && styles.buttonShow}`} 
              textClassName={styles.btnText}       
            />
            <span className={styles.spacer}></span>
            <NavLink
              href={user ? "/profile" : "/signup"}
              className={`${styles.button} ${isMenuOpen && styles.buttonShow}`}>
              <span className={styles.btnText}>{user ? "Profile" : "Signup"}</span>
            </NavLink>
          </div>
      </div>
      <div onClick={toggleLoginPopup} className={isLoginPopupOpen && styles.overlay}>
      </div>
      <div className={`${styles.loginPopupPos} ${isLoginPopupOpen ? styles.showPopup : styles.hidePopup}`}>
          <LoginPopup/>
      </div>
    </>
  )
}
