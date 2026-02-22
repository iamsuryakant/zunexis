"use client"

import { Coffee, Heart, Music } from "lucide-react"

export default function ZunexisFooter() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 md:px-8 py-3 text-[10px] md:text-xs text-muted-foreground">

        <span className="text-center md:text-left">
          © {new Date().getFullYear()} Zunexis by Suryakant Thakur. All rights reserved.
        </span>

        <span className="flex items-center gap-1 opacity-80">
          Made with
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