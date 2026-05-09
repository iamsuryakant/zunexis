"use client"

import { ReactNode } from "react"
import ZunexisHeader from "./ZunexisHeader"
import StatusBar from "@/components/StatusBar"
import { CommandPalette } from "@/components/navigation/CommandPalette"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      <ZunexisHeader />

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-3 rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/10 overflow-hidden">
          {children}
        </div>
      </main>

      <StatusBar />
      <CommandPalette />
    </div>
  )
}