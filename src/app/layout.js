import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navigation/Navbar/Navbar";
import { Roboto } from 'next/font/google';
import styles from './layout.module.css';
import MapWrapper from "@/components/Map/MapWrapper";
import { LocationProvider } from "@/contexts/LocationContext";
import { PoisProvider } from "@/contexts/PoisContext";
import { MenuProvider } from "@/contexts/MenuContext";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
})


export const metadata = {
  title: "QuietSpace",
  description: "Find your quiet spot.",
  manifest: "/manifest.json",
  icons: {
    apple: "icons/icon-192.png"
  }
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className={styles.mainLayout}>
          <AuthProvider>
            <LocationProvider>
              <MenuProvider>
                <PoisProvider>
                  <Navbar></Navbar>
                  <main className="mainContent">
                    <MapWrapper>
                      {children}
                    </MapWrapper>
                  </main>
                </PoisProvider>
              </MenuProvider>
            </LocationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
