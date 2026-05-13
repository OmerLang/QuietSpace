"use client";
import styles from "./LoginForm.module.css";
import { loginVaildation } from "@/../lib/validations/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLogin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function LoginForm({ setIsLoginWelcomeOpen }) {

const { isLoginPopupOpen, setIsLoginPopupOpen } = useMenu();
const { refreshAuth } = useAuth();


const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginVaildation),
    defaultValues: {
      email: "",
      password:""
    },
  });

  const login = async (data) => {
    const response = await handleLogin(data);
    if (!response.success) {
      if (response.message){
        setError("password", { type: "server", message: response.message })
        return
      }
    }
    await refreshAuth();
    setIsLoginWelcomeOpen(true);
    setTimeout(() => setIsLoginPopupOpen(false), 2000)
  }




  return (
    <form onSubmit={handleSubmit(login)} className={styles.loginForm}>
      <div className={styles.fieldDiv}>
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
        />
        <div className={`${styles.errorWrapper} ${errors.email ? styles.errorWrapperShow : ""}`}>
          <p>{errors.email?.message || ""}</p>
        </div>
      </div>

      <div className={styles.fieldDiv}>
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
        />
        <div className={`${styles.errorWrapper} ${errors.password ? styles.errorWrapperShow : ""}`}>
          <p>{errors.password?.message || ""}</p>
        </div>
      </div>
      <button
        className={styles.submitBtn}
        type="submit"
        disabled={isSubmitting}>
          <span 
            className={styles.submitBtnText}
            >
            {isSubmitting ? <LoadingSpinner size={30}/> : "Login"}
          </span>
        </button>
    </form>
  );
}
