"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation"
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const loginSubmit = async (e) => {
    if (loading)
      return;
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error){
      console.error("Login failed:", error.message); 
      alert(error.message);
      return;
    }
    router.push("/");
  };

  return (
    <form onSubmit={loginSubmit} className={styles.loginForm}>
      <div className={styles.fieldDiv}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.fieldDiv}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles.submitBtn} type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
  );
}
