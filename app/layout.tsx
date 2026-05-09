import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full" suppressHydrationWarning>
      <body className="h-full w-full" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}