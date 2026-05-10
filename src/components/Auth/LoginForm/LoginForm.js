"use client";
import styles from "./LoginForm.module.css";
import { loginVaildation } from "@/../lib/validations/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLogin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {

const router = useRouter();
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
    console.log("im here nowwwwwwwwwww")
    await refreshAuth();
    setIsLoginPopupOpen(false);

  }




  return (
    <form onSubmit={handleSubmit(login)} className={styles.loginForm}>
      <div className={styles.fieldDiv}>
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
        />
         <p>{errors.email && errors.email.message}</p>
      </div>

      <div className={styles.fieldDiv}>
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
        />
        <p>{errors.password && errors.password.message}</p>
      </div>
      <button className={styles.submitBtn} type="submit" disabled={isSubmitting}><span className={styles.submitBtnText}>{isSubmitting ? "Logging in..." : "Login"}</span></button>
    </form>
  );
}
