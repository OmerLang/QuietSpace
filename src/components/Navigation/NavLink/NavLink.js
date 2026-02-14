import Link from 'next/link';
import styles from './NavLink.module.css';

export default function NavLink({ href, children, className }) {
  return (
    <Link href={href} className={className}>{children}</Link>
  )
}

