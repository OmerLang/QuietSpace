import NavLink from '../NavLink/NavLink';
import NavAuthButton from '../NavAuthButton/NavAuthButton';
import { createClient } from '@/utils/supabase/server';
import styles from './Navbar.module.css';


export default async function Navbar() {
  const supabase = await createClient();
  const {data: {session}} = await supabase.auth.getSession();

  return (
    <nav className={styles.navbar}>
      <NavLink href="/">Logo</NavLink>
      <div className={styles.btnsWrapper}>
        {session && (
          <>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/settings">Settings</NavLink>
          <NavLink href="/favorites">Favorites</NavLink>
          </>
        )}
        <NavLink href="/about">About Us</NavLink>
        <NavLink href="/contact">Contact</NavLink>
        <NavAuthButton session={session}></NavAuthButton>
      </div>
    </nav>
  )
}