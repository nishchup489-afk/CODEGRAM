import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "CODEGRAM",
  description: "Build in public. Ship with purpose.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-(--bg-base) text-(--text-primary) antialiased">
        <ClerkProvider>
          {children}

        </ClerkProvider>
      </body>
    </html>
  );
}