import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navigation/Navbar/Navbar";
import { Roboto, Caveat_Brush } from "next/font/google";
import styles from "./layout.module.css";
import MapWrapper from "@/components/Map/MapWrapper";
import { LocationProvider } from "@/contexts/LocationContext";
import { PoisProvider } from "@/contexts/PoisContext";
import { MenuProvider } from "@/contexts/MenuContext";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-caveat-brush",
});

export const metadata = {
  title: "QuietSpace",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.className} ${caveatBrush.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableTheme>
          <div className={styles.mainLayout}>
            <AuthProvider>
              <LocationProvider>
                <MenuProvider>
                  <PoisProvider>
                    <Navbar></Navbar>
                    <ThemeToggle></ThemeToggle>
                    <main className="mainContent">
                      <MapWrapper>{children}</MapWrapper>
                    </main>
                  </PoisProvider>
                </MenuProvider>
              </LocationProvider>
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
