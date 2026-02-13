import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navigation/Navbar/Navbar";
import "./globals.css";



export const metadata = {
  title: "QuiteSpace",
  description: "Your sanctuary for productivity",
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'width=device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar></Navbar>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
