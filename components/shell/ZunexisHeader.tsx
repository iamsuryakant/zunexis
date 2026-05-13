"use client";

import ZunexisLogo from "@/components/shared/ZunexisLogo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";
import { Search, Play, Loader2 } from "lucide-react";
import { useCommandPalette } from "@/components/providers/command-palette-provider";
import { useExecutionStore } from "@/stores/useExecutionStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ZunexisHeader() {
  const { open } = useCommandPalette();
  const { executeCode, activeFileId, statuses } = useExecutionStore();
  const isRunning = activeFileId ? statuses[activeFileId] === "running" : false;

  return (
    <header className="sticky top-0 z-[100] flex h-12 w-full items-center justify-between gap-2 px-2 glass-header select-none sm:h-14 sm:gap-4 sm:px-4 sm:pt-1">
      {/* Branding */}
      <div className="flex min-w-0 items-center gap-4 shrink-0">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <ZunexisLogo
            compactOnMobile
            className="[&_svg]:size-7 sm:[&_svg]:size-8 dark:invert-0 invert opacity-90"
          />
        </Link>
      </div>

      {/* Global Search: The "Linear" Style */}
      <div className="min-w-0 flex-1 max-w-lg sm:px-4 lg:px-6">
        <button
          onClick={open}
          className="group flex h-9 w-full items-center justify-between gap-3 rounded-full 
               bg-muted/30 hover:bg-muted/50 border  hover:border-border/50
               transition-all px-3 text-muted-foreground/60 sm:px-4
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Search
              size={15}
              className="shrink-0 group-hover:text-primary transition-colors"
            />
            <span className="truncate text-xs font-medium sm:text-sm">Search workspace...</span>
          </div>

          <kbd
            className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-1.5 
                    font-mono text-[10px] font-medium opacity-100"
          >
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <Button
          onClick={executeCode}
          disabled={!activeFileId || isRunning}
          title={activeFileId ? "Execute active file" : "Open a file to execute"}
          className={cn(
            "h-8 w-8 rounded-full border border-transparent p-0 transition-colors duration-150 font-bold text-[10px] uppercase shadow-none sm:h-8 sm:w-[92px] sm:px-3 sm:tracking-[0.05em]",
            isRunning
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-primary hover:brightness-110 text-primary-foreground shadow-[0_0_15px_rgba(74,222,128,0.1)]",
          )}
        >
          <div className="flex w-full items-center justify-center gap-2">
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            {isRunning ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Play size={10} fill="currentColor" />
            )}
            </span>
            <span className="hidden sm:inline">{isRunning ? "Running" : "Execute"}</span>
          </div>
        </Button>

        <div className="mx-1 hidden h-3 w-px bg-border sm:block" />

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
  );
}
