import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from '@/components/ui/SmoothScroll';
import ProfileButton from '@/components/ui/ProfileButton';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Architect Portfolio",
  description: "Professional Architecture Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScroll />
        <CustomCursor />
        <ProfileButton />

        {children}
      </body>
    </html>
  );
}