"use client"

import ZunexisLogo from "@/components/shared/ZunexisLogo"
import ThemeToggle from "@/components/shared/ThemeToggle"
import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"
import { Search, Command } from "lucide-react"
import { useCommandPalette } from "@/components/providers/command-palette-provider"

export default function ZunexisHeader() {
  const { open } = useCommandPalette()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        
        {/* Left Section: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <ZunexisLogo />
          </Link>
        </div>

        {/* Center/Right Section: Navigation & Actions */}
        <div className="flex flex-1 items-center justify-end gap-3 md:justify-end">
          
          {/* Enhanced Search Button */}
          <button
            onClick={open}
            className="group relative flex h-9 w-full items-center justify-between gap-2 rounded-full border border-border/50 bg-muted/50 px-3 text-sm text-muted-foreground transition-all hover:bg-muted hover:ring-1 hover:ring-border sm:w-64"
          >
            <div className="flex items-center gap-2">
              <Search size={15} className="group-hover:text-foreground transition-colors" />
              <span className="inline-block">Search project...</span>
            </div>
            
            {/* KBD Shortcut - The "Premium" touch */}
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <div className="flex items-center gap-1">
            <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block" /> {/* Separator */}
            
            <ThemeToggle />

            <Link
              href="https://github.com/iamsuryakant/zunexis"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <IconBrandGithub size={19} stroke={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}