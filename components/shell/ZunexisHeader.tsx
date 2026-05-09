"use client"

import ZunexisLogo from "@/components/shared/ZunexisLogo"
import ThemeToggle from "@/components/shared/ThemeToggle"
import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"
import { Search, Play, Loader2, Command } from "lucide-react"
import { useCommandPalette } from "@/components/providers/command-palette-provider"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ZunexisHeader() {
  const { open } = useCommandPalette()
  const { executeCode, activeFileId, statuses } = useExecutionStore()
  const isRunning = activeFileId ? statuses[activeFileId] === "running" : false

  return (
    <header className="sticky top-0 z-[100] w-full h-11 flex items-center justify-between px-4 glass-header select-none">
      {/* Branding */}
      <div className="shrink-0">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <ZunexisLogo className="h-4 w-auto dark:invert-0 invert opacity-90" />
        </Link>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-lg px-6">
        <button
          onClick={open}
          className="group flex h-8 w-full items-center justify-between gap-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-all px-4 text-muted-foreground/40 border border-transparent hover:border-border/50"
        >
          <div className="flex items-center gap-2.5">
            <Search size={13} className="group-hover:text-primary transition-colors" />
            <span className="text-[12px] font-medium tracking-tight">Search workspace...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 opacity-20">
            <Command size={10} />
            <span className="text-[9px] font-bold">K</span>
          </div>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={executeCode}
          disabled={!activeFileId || isRunning}
          className={cn(
            "h-7 rounded-full px-5 transition-all duration-200 font-bold text-[10px] tracking-[0.05em] uppercase shadow-none",
            isRunning
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-primary hover:brightness-110 text-primary-foreground border-none active:scale-95 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
          )}
        >
          {isRunning ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={10} fill="currentColor" className="mr-2" />
          )}
          <span>{isRunning ? "Running" : "Execute"}</span>
        </Button>

        <div className="h-3 w-px bg-border mx-1" />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="https://github.com/iamsuryakant/zunexis"
            target="_blank"
            className="p-1.5 rounded-md text-muted-foreground/30 hover:text-foreground transition-all"
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}