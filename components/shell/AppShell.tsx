"use client"

import { ReactNode } from "react"
import ZunexisHeader from "./ZunexisHeader"
import ZunexisFooter from "./ZunexisFooter"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <ZunexisHeader />
      </div>

      <main className="flex-1 overflow-hidden px-3 py-3">
        <div className="h-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {children}
        </div>
      </main>

      <ZunexisFooter />
    </div>
  )
}