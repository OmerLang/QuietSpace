"use client";
import NavLink from "@/components/Navigation/NavLink/NavLink";
import NavAuthButton from "@/components/Navigation/NavAuthButton/NavAuthButton";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Navbar.module.css";
import { useMenu } from "@/contexts/MenuContext";
import LoginPopup from "@/components/LoginPopup/LoginPopup";
import SignupPopup from "@/components/SignupPopup/SignupPopup";
import { About } from "@/components/About/About";
import WelcomeOAuth from "@/components/WelcomeOAuth/WelcomeOAuth";
import { Searchbar } from "@/components/Searchbar/Searchbar";

export default function Navbar() {
  const { user } = useAuth();
  const {
    isMenuOpen,
    setIsMenuOpen,
    activeOverlay,
    openOverlay,
    closeOverlay,
    lastOpen,
  } = useMenu();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const toggleLoginPopup = () => {
  //   setIsMenuOpen(false);
  //   if (isSignupPopupOpen === true) {
  //     setIsSignupPopupOpen(false);
  //   }
  //   if (isAboutOpen === true) {
  //     setIsAboutOpen(false);
  //   }
  //   setIsLoginPopupOpen(!isLoginPopupOpen);
  // };

  // const toggleSignupPopup = () => {
  //   setIsMenuOpen(false);
  //   if (isLoginPopupOpen === true) {
  //     setIsLoginPopupOpen(false);
  //   }
  //   if (isAboutOpen === true) {
  //     setIsAboutOpen(false);
  //   }
  //   setIsSignupPopupOpen(!isSignupPopupOpen);
  // };

  // const toggleAbout = () => {
  //   if (isLoginPopupOpen === true) {
  //     setIsLoginPopupOpen(false);
  //   }
  //   if (isSignupPopupOpen === true) {
  //     setIsSignupPopupOpen(false);
  //   }
  //   setIsMenuOpen(false);
  //   setIsAboutOpen(!isAboutOpen);
  // };

  const toggleOverlay = () => {
    closeOverlay();
    // if (isLoginPopupOpen === true) {
    //   setIsLoginPopupOpen(false);
    // }
    // if (isSignupPopupOpen === true) {
    //   setIsSignupPopupOpen(false);
    // }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <Searchbar />
      </div>
      <div className={styles.navbarContainer}>
        <button onClick={toggleMenu} className={styles.menuBtn}>
          <span className={isMenuOpen ? styles.firstLine : ""}></span>
          <span className={isMenuOpen ? styles.middleLine : ""}></span>
          <span className={isMenuOpen ? styles.thirdLine : ""}></span>
        </button>
        <div
          className={`${styles.innerContainer} ${isMenuOpen ? styles.show : ""}`}
        >
          <button
            className={`${styles.button} ${activeOverlay === "about" ? styles.buttonShow : ""}`}
            onClick={() => openOverlay("about")}
          >
            <span className={styles.btnText}>About</span>
          </button>
          <span className={styles.spacer}></span>
          <NavAuthButton
            onClick={() => {
              if (!user) {
                openOverlay("login");
              }
            }}
            className={`${styles.button} ${isMenuOpen ? styles.buttonShow : ""}`}
            textClassName={styles.btnText}
          />
          {!user && (
            <>
              <span className={styles.spacer}></span>
              <button
                className={`${styles.button} ${isMenuOpen ? styles.buttonShow : ""}`}
                onClick={() => openOverlay("signup")}
              >
                <span className={styles.btnText}>Signup</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div
        onClick={toggleOverlay}
        className={
          activeOverlay === "login" || activeOverlay === "signup"
            ? styles.overlay
            : ""
        }
      ></div>
      <div
        className={`${styles.loginPopupPos} ${activeOverlay === "login" ? styles.showPopup : lastOpen === "login" ? styles.hidePopup : ""}`}
      >
        <LoginPopup key={activeOverlay === "login" ? "open" : "closed"} />
      </div>
      <div
        className={`${styles.signupPopupPos} ${activeOverlay === "signup" ? styles.showPopup : lastOpen === "signup" ? styles.hidePopup : ""}`}
      >
        <SignupPopup key={activeOverlay === "signup" ? "open" : "closed"} />
      </div>
      <div
        className={`${styles.aboutPopupPos} ${activeOverlay === "about" ? styles.showAboutPopup : lastOpen === "about" ? styles.hideAboutPopup : ""}`}
      >
        <About key={activeOverlay === "about" ? "open" : "closed"} />
      </div>
      <WelcomeOAuth />
    </>
  );
}
