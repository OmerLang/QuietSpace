import Link from 'next/link';

export default function NavLink({ href, children, className, onClick, style }) {
  return (
    <Link href={href} onClick={onClick} style={style} className={className}>{children}</Link>
  )
}

