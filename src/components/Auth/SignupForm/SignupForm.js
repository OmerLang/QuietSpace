'use client'
import styles from './SignupForm.module.css';
import { signupVaildation } from "@/../lib/validations/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSignup } from "@/app/actions/auth";
import { useMenu } from '@/contexts/MenuContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';


export default function SignupForm({ setIsSignupWelcomeOpen }) {

  const { isLoginPopupOpen, setIsLoginPopupOpen, isSignupPopupOpen, setIsSignupPopupOpen } = useMenu();

  const handleLoginRedirect = () => {
  setIsSignupPopupOpen(false);
  setIsLoginPopupOpen(true);
}

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupVaildation),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  const signup = async (data) => {
    const response = await handleSignup(data);
    if (!response.success) {
      console.log(response.errors)
      return 
    }
    setIsSignupWelcomeOpen(true)
    setTimeout(() => setIsSignupPopupOpen(false), 5000)
    setTimeout(() => setIsLoginPopupOpen(true), 5200)
    return
  }

  

  return (
    <form onSubmit={handleSubmit(signup)} className={styles.signupForm}>
      <div className={styles.fieldDiv}>
        <label>Full Name</label>
        <input {...register("fullName")}/>
        <div className={`${styles.errorWrapper} ${errors.fullName ? styles.errorWrapperShow : ""}`}>
         <p>{errors.fullName?.message || ""}</p>
        </div>
      </div>
      <div className={styles.fieldDiv}>
        <label>Email</label>
        <input {...register("email")}/>
        <div className={`${styles.errorWrapper} ${errors.email ? styles.errorWrapperShow : ""}`}>
          <p>{errors.email?.message || "" }</p>
        </div>
      </div>
      <div className={styles.fieldDiv}>
        <label>Password</label>
        <input {...register("password")} type='password'/>
        <div className={`${styles.errorWrapper} ${errors.password ? styles.errorWrapperShow : ""}`}>
          <p>{errors.password?.message || ""}</p>
        </div>
      </div>
      <div className={styles.fieldDiv}>
        <label>Confirm password</label>
        <input {...register("confirmPassword")} type='password'/>
        <div className={`${styles.errorWrapper} ${errors.confirmPassword ? styles.errorWrapperShow : ""}`}>
          <p>{errors.confirmPassword?.message || "" }</p>
        </div>
      </div>
      <button
        className={styles.redirectContainer}
        type="button"
        onClick={handleLoginRedirect}>
          <span>
            Already have an account? click to login
          </span>
      </button>
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}><span className={styles.submitBtnText}>{isSubmitting ? <LoadingSpinner size={30}/> : "Signup"}</span></button>
    </form>
  )
}