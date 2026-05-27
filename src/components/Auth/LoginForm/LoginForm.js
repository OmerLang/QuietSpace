"use client";
import styles from "./LoginForm.module.css";
import { loginVaildation } from "@/../lib/validations/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLogin } from "@/app/actions/auth";
import { useMenu } from "@/contexts/MenuContext";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm({ setIsLoginWelcomeOpen }) {
  const { setIsLoginPopupOpen, setIsSignupPopupOpen } = useMenu();
  const { refreshAuth } = useAuth();
  const supabase = createClient();

  const handleSignupRedirect = () => {
    setIsLoginPopupOpen(false);
    setIsSignupPopupOpen(true);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginVaildation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data) => {
    const response = await handleLogin(data);
    if (!response.success) {
      if (response.message) {
        setError("password", { type: "server", message: response.message });
        return;
      }
    }
    await refreshAuth();
    setIsLoginWelcomeOpen(true);
    setTimeout(() => setIsLoginPopupOpen(false), 2000);
  };

  const handleGoogleAuth = async () => {
    const currentOrigin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${currentOrigin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    if (error) {
      console.error("Google login initialization failed:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(login)} className={styles.loginForm}>
      <div className={styles.fieldDiv}>
        <label htmlFor="email">Email</label>
        <input {...register("email")} />
        <div
          className={`${styles.errorWrapper} ${errors.email ? styles.errorWrapperShow : ""}`}
        >
          <p>{errors.email?.message || ""}</p>
        </div>
      </div>

      <div className={styles.fieldDiv}>
        <label>Password</label>
        <input type="password" {...register("password")} />
        <div
          className={`${styles.errorWrapper} ${errors.password ? styles.errorWrapperShow : ""}`}
        >
          <p>{errors.password?.message || ""}</p>
        </div>
      </div>

      <button
        className={styles.redirectContainer}
        type="button"
        onClick={handleSignupRedirect}
      >
        <span>New? click to sign-up</span>
      </button>
      <div className={styles.btnsWrapper}>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={isSubmitting}
        >
          <span className={styles.submitBtnText}>
            {isSubmitting ? <LoadingSpinner size={30} /> : "Login"}
          </span>
        </button>
        <button
          className={styles.googleBtn}
          type="button"
          onClick={handleGoogleAuth}
        >
          <div className={styles.svgDivGoogle}>
            <span>Sign in with google</span>
            <svg
              viewBox="-3 0 262 262"
              preserveAspectRatio="xMidYMid"
              fill="#000000"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              ></path>
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              ></path>
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              ></path>
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              ></path>
            </svg>
          </div>
        </button>
      </div>
    </form>
  );
}
