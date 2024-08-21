import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Web3Providers from "@/components/Web3Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artcast",
  description:
    "AI-powered collaborative art stories, registered on Story Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Providers>
          <Navbar />
          {children}
        </Web3Providers>
      </body>
    </html>
  );
}
