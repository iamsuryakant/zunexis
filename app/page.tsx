import AppShell from "@/components/shell/AppShell"
import IDEClient from "@/components/layout/IDEClient"

export default function Home() {
  return (
    <AppShell>
      <div className="h-full">
        <IDEClient />
      </div>
    </AppShell>
  )
}