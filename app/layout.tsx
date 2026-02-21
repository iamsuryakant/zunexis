import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zunexis",
  description: "Code • Compile • Execute",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`h-full bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <TooltipProvider> */}
        <ThemeProvider>
          <div className="h-full flex flex-col">

          {children}
          </div>
        </ThemeProvider>
        {/* </TooltipProvider> */}
      </body>
    </html>
  );
}
