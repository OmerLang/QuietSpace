'use client'
import styles from './SignupForm.module.css';
import { signupVaildation } from "@/../lib/validations/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSignup } from "@/app/actions/auth";
import { useMenu } from '@/contexts/MenuContext';


export default function SignupForm() {

  const { isLoginPopupOpen, setisLoginPopupOpen, isSignupPopupOpen, setIsSignupPopupOpen } = useMenu();

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
    setIsSignupPopupOpen(false)
    setisLoginPopupOpen(true)
    console.log("successfuly signed up")
    return
  }

  

  return (
    <form onSubmit={handleSubmit(signup)} className={styles.signupForm}>
      <div className={styles.fieldDiv}>
        <label>Full Name</label>
        <input {...register("fullName")}/>
        {errors.fullName && <p>{errors.fullName.message}</p>}
      </div>
      <div className={styles.fieldDiv}>
        <label>Email</label>
        <input {...register("email")}/>
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className={styles.fieldDiv}>
        <label>Password</label>
        <input {...register("password")}/>
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className={styles.fieldDiv}>
        <label>Confirm password</label>
        <input {...register("confirmPassword")}/>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}><span className={styles.submitBtnText}>{isSubmitting ? "Logging in..." : "Signup"}</span></button>
    </form>
  )
}