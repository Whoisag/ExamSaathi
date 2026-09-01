import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

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
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col antialiased bg-white text-black selection:bg-[#FF4D00] selection:text-white"
        suppressHydrationWarning
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "0px",
              border: "2px solid #000000",
              background: "#FFFFFF",
              color: "#000000",
              boxShadow: "4px 4px 0px 0px #000000",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: "bold",
            },
            success: {
              iconTheme: {
                primary: "#FF4D00",
                secondary: "#FFFFFF",
              },
            },
            error: {
              style: {
                border: "2px solid #DC2626",
              },
            },
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
