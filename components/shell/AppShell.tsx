"use client"

import { ReactNode } from "react"
import ZunexisHeader from "./ZunexisHeader"
import StatusBar from "@/components/StatusBar"
import { CommandPalette } from "@/components/navigation/CommandPalette"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans antialiased">
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