import { Inter } from "next/font/google"; // Font import karein
import "./globals.css";
import Layout from "@/components/Layout";
import NextAuthProvider from "@/components/SessionProvider";

// Font ko configure karein
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // CSS variable ka naam dein
});

export const metadata = {
  title: "Arshad Management",
  description: "A personal CRM for freelancers",
};

export default function RootLayout({ children }) {
  return (
    // class mein font variable add karein
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <NextAuthProvider>
          <Layout>{children}</Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
