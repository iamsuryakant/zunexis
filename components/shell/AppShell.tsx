"use client"

import { ReactNode } from "react"
import ZunexisHeader from "./ZunexisHeader"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">

      <ZunexisHeader />

      <main className="flex-1 overflow-hidden bg-muted/40 px-8 py-6">
        {children}
      </main>

    </div>
  )
}