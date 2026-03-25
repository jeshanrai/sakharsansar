import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Poppins for strong, earthy headings
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  metadataBase: new URL("https://himalayanjaggery.com"),
  title: "Himalayan Jaggery | Natural from Sankhuwasabha",
  description: "Pure, Chemical-Free Jaggery sourced directly from farmers in Sankhuwasabha, Nepal. Order 100% natural and handcrafted gur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-white text-black selection:bg-black selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
