import LoginForm from "../Auth/LoginForm/LoginForm";
import styles from './LoginPopup.module.css'
import { useMenu } from "@/contexts/MenuContext";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";




export default function LoginPopup () {
  const { setIsLoginPopupOpen } = useMenu();
  const [isLoginWelcomeOpen, setIsLoginWelcomeOpen] = useState(false)
  const { user } = useAuth();
  const fname = user?.user_metadata?.full_name.split(' ')[0];

  return (
      <div className={styles.container}>
        <button 
          className={styles.closeBtn}
          onClick={() => setIsLoginPopupOpen(false)}
          >
          <span className={styles.x1}></span>
          <span className={styles.x2}></span>
        </button>
        <div className={styles.loginFormContainer}>
          <div className={`${styles.form} ${isLoginWelcomeOpen ? styles.formHide : ""}`}>
            <div className={styles.loginTitle}>
              <h1>Login</h1>
            </div>
            <LoginForm setIsLoginWelcomeOpen={setIsLoginWelcomeOpen}></LoginForm>
          </div>
          <div className={`${styles.welcomeText} ${isLoginWelcomeOpen ? styles.welcomeTextShow : ""}`}><h1>Welcome</h1> <span>{fname}</span></div>
        </div> 
      </div>
  )
}