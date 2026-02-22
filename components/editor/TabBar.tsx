"use client"

import { X, Plus } from "lucide-react"
import { useExecutionStore } from "@/store/useExecutionStore"
import { Button } from "@/components/ui/button"

export default function TabBar() {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    addTab,
    closeTab,
  } = useExecutionStore()

  return (
    <div className="flex items-center border-b border-border bg-muted/40 px-4 h-12">

      <div className="flex items-center gap-1 overflow-x-auto">

        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer
              text-sm
              ${
                activeTabId === tab.id
                  ? "bg-background border border-border border-b-0"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {tab.name}

            {tabs.length > 1 && (
              <X
                className="h-3 w-3 opacity-70 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
              />
            )}
          </div>
        ))}

      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={addTab}
        className="ml-2"
      >
        <Plus className="h-4 w-4" />
      </Button>

    </div>
  )
}