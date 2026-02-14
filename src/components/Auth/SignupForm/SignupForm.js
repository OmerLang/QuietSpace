'use client'
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './SignupForm.module.css'


export default function SignupForm() {
  const [values, setValues] = useState({
    email: '',
    fullName: '',
    password: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const onSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          phone: values.phone,
          city:values.city
        }
      }
    })
    if (error) {
      setLoading(false);
      return console.log("error:" + error)
    }
    router.push("/login");
  }

  return (
    <form onSubmit={onSignUp} className={styles.signupForm}>
      <div className={styles.fieldDiv}>
        <label>Email:</label>
        <input name="email" type="email" value={values.email} onChange={handleChange}/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Full name:</label>
        <input name="fullName" type="text" value={values.fullName} onChange={handleChange}/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Password:</label>
        <input name="password" type="password" value={values.password} onChange={handleChange}/>
      </div>
      <div className={styles.fieldDiv}>
        <label>Phone number:</label>
        <input name="phone" type="phone" value={values.phone} onChange={handleChange}/>
      </div>
      <div className={styles.fieldDiv}>
        <label>City:</label>
        <select name="city" className={styles.citySelect} value={values.city} onChange={handleChange} required>
          <option value="" disabled>Select a city</option>
          <option value="Tel Aviv">Tel Aviv</option>
          <option value="Jerusalem">Jerusalem</option>
          <option value="Beer Sheva">Beer Sheva</option>
          <option value="Haifa">Haifa</option>
          <option value="Rishon LeZion">Rishon LeZion</option>
          <option value="Ashkelon">Ashkelon</option>
        </select>
      </div>
      <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Loading..." : "Sign-Up"}</button>
    </form>
  )
}