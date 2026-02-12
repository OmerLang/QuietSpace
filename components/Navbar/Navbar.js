import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import styles from './Navbar.module.css';


export default async function Navbar() {
  const supabase = createServerComponentClient({ cookies });
  const {data: {session}} = await supabase.auth.getSession();

  return (
    <nav className={styles.navbar}>
      <button className={styles.logo}>Logo</button>
      <div className={styles.btns-wrapper}>



      </div>
    </nav>
  )




}