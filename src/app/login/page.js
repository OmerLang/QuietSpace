import LoginForm from "@/components/Auth/LoginForm/LoginForm"
import styles from "./login.module.css";








export default function Login() {
  return (
    <div className={styles.grid}>
      <div className={styles.content}>
        <div className={styles.loginTitle}>
          <h1>Login</h1>
        </div>
        <div className={styles.loginFormContainer}>
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  )
}