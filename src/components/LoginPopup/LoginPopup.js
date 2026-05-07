import LoginForm from "../Auth/LoginForm/LoginForm";
import styles from './LoginPopup.module.css'
import { useMenu } from "@/contexts/MenuContext";




export default function LoginPopup () {
  const { setIsLoginPopupOpen } = useMenu();

  return (
      <div className={styles.container}>
        <button 
          className={styles.closeBtn}
          onClick={() => setIsLoginPopupOpen(false)}
          >
          <span className={styles.x1}></span>
          <span className={styles.x2}></span>
        </button>
        <div className={styles.loginTitle}>
          <h1>Login</h1>
        </div>
        <div className={styles.loginFormContainer}>
          <LoginForm></LoginForm>
        </div>
      </div>
  )
}