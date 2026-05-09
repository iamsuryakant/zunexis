"use client"

import { Files, Search } from "lucide-react"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  icon: React.ElementType
  label: string
  shortcut?: string
}

export default function ActivityBar() {
  const { sidebarView, setSidebarView } = useExecutionStore()

  const items: ActivityItem[] = [
    { id: 'explorer', icon: Files, label: 'Explorer', shortcut: '⌘E' },
    { id: 'search', icon: Search, label: 'Search', shortcut: '⌘F' },
  ]

  return (
    <aside className="w-12 flex flex-col items-center py-3 bg-card border-r border-border/50">
      <div className="flex flex-col items-center gap-0.5">
        {items.map((item) => {
          const isActive = sidebarView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setSidebarView(item.id)}
              className={cn(
                "group relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150",
                "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                isActive && "text-primary bg-accent/30"
              )}
              title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />

              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-primary rounded-r-full" />
              )}

              <span className="absolute left-full ml-2 px-2 py-1 bg-card border border-border/50 rounded-md text-[11px] whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}