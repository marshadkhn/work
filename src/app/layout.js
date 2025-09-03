import "./globals.css";
import Layout from "@/components/Layout";
import NextAuthProvider from "@/components/SessionProvider"; // Import the provider

export const metadata = {
  title: "Freelancer crm",
  description: "A personal CRM for freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {" "}
          {/* Wrap with the provider */}
          <Layout>{children}</Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
