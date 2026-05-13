import SignupForm from "../Auth/SignupForm/SignupForm";
import { useMenu } from "@/contexts/MenuContext";
import styles from "./SignupPopup.module.css"
import { useState } from "react";



export default function SignupPopup () {
  const { setIsSignupPopupOpen } = useMenu();
  const [isSignupWelcomeOpen, setIsSignupWelcomeOpen] = useState(false)

  return (
      <div className={styles.container}>
        <button 
          className={styles.closeBtn}
          onClick={() => setIsSignupPopupOpen(false)}
          >
          <span className={styles.x1}></span>
          <span className={styles.x2}></span>
        </button>
       
        <div className={styles.signupFormContainer}>
          <div className={`${styles.form} ${isSignupWelcomeOpen ? styles.formHide : ""}`}>
            <div className={styles.signupTitle}>
              <h1>Signup</h1>
            </div>
            <SignupForm setIsSignupWelcomeOpen={setIsSignupWelcomeOpen}></SignupForm>
          </div>
          <div className={`${styles.welcomeText} ${isSignupWelcomeOpen ? styles.welcomeTextShow : ""}`}><h1>Check your inbox!</h1><p>A verification email is on its way.<br/>Please confirm your email address to activate your account.</p></div>
        </div>
      </div>
  )
}