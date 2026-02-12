import Link from 'next/link';
import styles from './NavLink.module.css';

export default function NavLink({ href, children }) {
  return (
    <Link href={href} className={styles.link}>{children}</Link>
  )
}

