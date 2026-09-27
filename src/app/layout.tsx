import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Tressly";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Hair accessories worth keeping`,
    template: `%s — ${siteName}`,
  },
  description:
    "Scrunchies, claw clips, clutchers, headbands and hair pins — delivered across India.",
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Hair accessories worth keeping`,
    description:
      "Scrunchies, claw clips, clutchers, headbands and hair pins — delivered across India.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster position="bottom-center" toastOptions={{ style: { fontFamily: "var(--font-manrope)" } }} />
      </body>
    </html>
  );
}
