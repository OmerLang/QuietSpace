'use client'
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient();

  const logout = async () => {
    if (!user){
      return console.log("Cannot logout: user is not logged in")
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      return console.log("error logging out")
    }
  }
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session ? session.user : null);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null)
      setLoading(false);
    })

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

