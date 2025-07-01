import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/useAuth";
import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Intranet Credito Ya",
  description: "Desarrollado por TripCode",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={GeistSans.className}
      >
        <SpeedInsights />
        <Analytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
