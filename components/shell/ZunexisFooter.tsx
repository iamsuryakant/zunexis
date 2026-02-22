"use client"

import { Coffee, Heart, Music } from "lucide-react"

export default function ZunexisFooter() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-2 px-6 text-xs text-muted-foreground">

        <span className="whitespace-nowrap">
          © {new Date().getFullYear()} Zunexis by Suryakant Thakur. All rights reserved.
        </span>

        <span className="hidden sm:inline-flex items-center gap-1 opacity-80">
          • Made with
          
          <Coffee className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="px-0.5 text-muted-foreground/60">+</span>

          <Heart className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 fill-current" />
          <span className="px-0.5 text-muted-foreground/60">+</span>

          <Music className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />

          <span className="ml-1">in India</span>
        </span>

      </div>
    </footer>
  )
}