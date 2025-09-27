import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { MSWComponent } from "@/mocks/MSWComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Platform",
  description: "Create your professional resume with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {process.env.NODE_ENV === 'development' && <MSWComponent />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}