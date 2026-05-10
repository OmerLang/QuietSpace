import SignupForm from "../Auth/SignupForm/SignupForm";
import { useMenu } from "@/contexts/MenuContext";
import styles from "./SignupPopup.module.css"



export default function SignupPopup () {
  const { setIsSignupPopupOpen } = useMenu();

  return (
      <div className={styles.container}>
        <button 
          className={styles.closeBtn}
          onClick={() => setIsSignupPopupOpen(false)}
          >
          <span className={styles.x1}></span>
          <span className={styles.x2}></span>
        </button>
        <div className={styles.signupTitle}>
          <h1>Signup</h1>
        </div>
        <div className={styles.signupFormContainer}>
          <SignupForm></SignupForm>
        </div>
      </div>
  )
}