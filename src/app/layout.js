import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navigation/Navbar/Navbar";
import { Roboto } from 'next/font/google';
import styles from './layout.module.css';
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
})



export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className={styles.mainLayout}>
          <AuthProvider>
            <Navbar></Navbar>
            <main className="mainContent">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
