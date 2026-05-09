"use client"

import IDEClient from "@/components/layout/IDEClient"
import AppShell from "@/components/shell/AppShell"

export default function Page() {
  return (
    <AppShell>
      {/* This renders your IDELayout inside the rounded card */}
      <IDEClient />
    </AppShell>
  )
}