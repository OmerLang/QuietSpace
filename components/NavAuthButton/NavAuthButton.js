'use client';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import styles from './NavAuthButton.module.css';

export default function NavAuthButton ({ session }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const logOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  }
  return (
    <>
    {session ? <button className={styles.button} onClick={logOut}>LogOut</button> : <Link className={styles.button} href="/login">Login</Link>} 
    </>
  )
}

