import Link from 'next/link';
import styles from './NavLink.module.css';

export default function NavLink({ href, children, className, onClick }) {
  return (
    <Link href={href} onClick={onClick} className={className}>{children}</Link>
  )
}

