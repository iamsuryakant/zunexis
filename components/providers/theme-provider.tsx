"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CommandPaletteProvider } from "./command-palette-provider"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={300}>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}