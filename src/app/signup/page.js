import SignupForm from "@/components/Auth/SignupForm/SignupForm";
import styles from './signup.module.css';








export default function Signup() {
  return (
    <div className={styles.grid}>
      <div className={styles.content}>
        <div className={styles.signupTitle}>
          <h1>Signup</h1>
        </div>
        <div className={styles.signupFormContainer}>
          <SignupForm></SignupForm>
        </div>
      </div>
    </div>
  )
}