import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExamSaathi — Predictive PYQ Intelligence & Formula Sheets",
  description:
    "Data-driven exam trends, topic predictors, gap alerts, and KaTeX formula sheets for JEE Main, NEET, CBSE 10, CBSE 12, and CUET.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${archivoBlack.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-white text-black selection:bg-[#FF4D00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
