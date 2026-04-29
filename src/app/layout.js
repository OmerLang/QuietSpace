import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navigation/Navbar/Navbar";
import { Roboto } from 'next/font/google';
import styles from './layout.module.css';
import MapWrapper from "@/components/Map/MapWrapper";
import { LocationProvider } from "@/contexts/LocationContext";
import MobileDetector from "@/components/MobileDetector/MobileDetector";
import { PoisProvider } from "@/contexts/PoisContext";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
})


export const metadata = {
  title: "QuietSpace",
  description: "Find your quiet spot.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // Essential for PWA/Mobile notches
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className={styles.mainLayout}>
          <AuthProvider>
            <LocationProvider>
              <MobileDetector/>
                <PoisProvider>
                <Navbar></Navbar>
                <main className="mainContent">
                  <MapWrapper>
                    {children}
                  </MapWrapper>
                </main>
              </PoisProvider>
            </LocationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
