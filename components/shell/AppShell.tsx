"use client"

import { ReactNode } from "react"
import ZunexisHeader from "./ZunexisHeader"
import StatusBar from "@/components/StatusBar"
import { CommandPalette } from "@/components/navigation/CommandPalette"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* SOLID PINNED HEADER */}
      <ZunexisHeader />

      {/* EDGE-TO-EDGE WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </main>

      {/* SOLID PINNED STATUS BAR */}
      <StatusBar />
      <CommandPalette />
    </div>
  )
}
