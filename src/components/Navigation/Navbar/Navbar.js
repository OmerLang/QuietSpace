'use client'
import NavLink from '@/components/Navigation/NavLink/NavLink';
import NavAuthButton from '@/components/Navigation/NavAuthButton/NavAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.css';
import { useMenu } from '@/contexts/MenuContext';
import LoginPopup from '@/components/LoginPopup/LoginPopup';
import SignupPopup from '@/components/SignupPopup/SignupPopup';
import { About } from '@/components/About/About';


export default function Navbar() {
  const { user } = useAuth();
  const { isMenuOpen,
          setIsMenuOpen,
          isLoginPopupOpen,
          setIsLoginPopupOpen,
          isSignupPopupOpen,
          setIsSignupPopupOpen,
          isAboutOpen,
          setIsAboutOpen } = useMenu();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleLoginPopup = () => {
    setIsMenuOpen(false);
    if (isSignupPopupOpen === true) {
      setIsSignupPopupOpen(false)
    }
    if (isAboutOpen === true) {
      setIsAboutOpen(false)
    }
    setIsLoginPopupOpen(!isLoginPopupOpen)
  }

  const toggleSignupPopup = () => {
    setIsMenuOpen(false);
    if (isLoginPopupOpen === true) {
      setIsLoginPopupOpen(false)
    }
    if (isAboutOpen === true) {
      setIsAboutOpen(false)
    }
    setIsSignupPopupOpen(!isSignupPopupOpen)
  }

  const toggleAbout = () => {
    if (isLoginPopupOpen === true) {
      setIsLoginPopupOpen(false)
    }
    if (isSignupPopupOpen === true) {
      setIsSignupPopupOpen(false)
    }
    setIsMenuOpen(false);
    setIsAboutOpen(!isAboutOpen);
  }

  const toggleOverlay = () => {
    if (isLoginPopupOpen === true) {
      setIsLoginPopupOpen(false)
    }
    if (isSignupPopupOpen === true) {
      setIsSignupPopupOpen(false)
    }
    setIsMenuOpen(false)
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
          <button
            className={`${styles.button} ${isAboutOpen ? styles.buttonShow : ""}`}
            onClick={toggleAbout}
            >
            <span className={styles.btnText}>About</span>
          </button>
          <span className={styles.spacer}></span>
          <NavAuthButton
            onClick={() => {if(!user) {toggleLoginPopup()} }}
            className={`${styles.button} ${isMenuOpen ? styles.buttonShow : ""}`} 
            textClassName={styles.btnText}       
          />
          <span className={styles.spacer}></span>
          {user ? (
            <NavLink
              href="/profile"
              className={`${styles.button} ${isMenuOpen ? styles.buttonShow : ""}`}>
              <span className={styles.btnText}>Profile</span>
            </NavLink>
          ) : (
            <button
            className={`${styles.button} ${isMenuOpen ? styles.buttonShow : ""}`}
            onClick={toggleSignupPopup}
            >
            <span className={styles.btnText}>Signup</span>
          </button>
          )}
        </div>
      </div>
      <div onClick={toggleOverlay} className={isLoginPopupOpen || isSignupPopupOpen ? styles.overlay : ""}>
      </div>
      <div className={`${styles.loginPopupPos} ${isLoginPopupOpen === true ? styles.showPopup : (isLoginPopupOpen === false ? styles.hidePopup : "")}`}>
        <LoginPopup key ={isLoginPopupOpen ? "open" : "closed"} />
      </div>
      <div className={`${styles.signupPopupPos} ${isSignupPopupOpen === true ? styles.showPopup : (isSignupPopupOpen === false ? styles.hidePopup : "")}`}>
        <SignupPopup key = {isSignupPopupOpen ? "open" : "closed" } />
      </div>
      <div className={`${styles.aboutPopupPos} ${isAboutOpen === true ? styles.showAboutPopup : (isAboutOpen === false ? styles.hideAboutPopup : "")}`}>
        <About key = {isAboutOpen ? "open" : "closed" } />
      </div>
    </>
  )
}
