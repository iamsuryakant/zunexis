"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import { X, Loader2, FileCode, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"

export default function TabBar() {
  const {
    files,
    openFileIds,
    activeFileId,
    setActiveFile,
    closeTab,
    statuses,
  } = useExecutionStore()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const openTabs = openFileIds
    .map(id => files.find(f => f.id === id))
    .filter(Boolean)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [openTabs])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 240
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -amount : amount, 
        behavior: 'smooth' 
      })
    }
  }

  if (openTabs.length === 0) return null

  return (
    <div className="h-9 flex items-center bg-background border-b border-border/40 select-none">
      
      {/* 1. Integrated Scroll Controls (Only show when overflow exists) */}
      <AnimatePresence>
        {canScrollLeft && (
          <button 
            onClick={() => scroll('left')}
            className="flex items-center justify-center w-6 h-full border-r border-border/40 hover:bg-accent text-muted-foreground z-20 bg-background"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </AnimatePresence>

      {/* 2. Flush Tabs Area */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 flex items-center h-full overflow-x-auto no-scrollbar scroll-smooth"
      >
        {openTabs.map((tab) => {
          const isTabActive = tab!.id === activeFileId
          const isRunning = statuses[tab!.id] === "running"

          return (
            <div
              key={tab!.id}
              onClick={() => setActiveFile(tab!.id)}
              className={cn(
                "group relative flex items-center gap-2 px-3 h-full cursor-pointer border-r border-border/40 min-w-[120px] max-w-[200px] transition-colors",
                isTabActive 
                  ? "bg-background text-foreground" 
                  : "bg-muted/20 text-muted-foreground/60 hover:bg-muted/40 hover:text-muted-foreground"
              )}
            >
              {/* Active Top Accent Line */}
              {isTabActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              )}

              <FileCode 
                size={13} 
                className={cn(
                  "shrink-0",
                  isTabActive ? "text-primary" : "text-muted-foreground/40"
                )} 
              />

              <span className="truncate text-[11px] font-medium">
                {tab!.name}
              </span>

              <div className="ml-auto flex items-center justify-center w-4 h-4">
                {isRunning ? (
                  <Loader2 size={11} className="animate-spin text-emerald-500" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab!.id)
                    }}
                    className={cn(
                      "p-0.5 rounded-sm hover:bg-accent hover:text-foreground transition-opacity",
                      isTabActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {canScrollRight && (
          <button 
            onClick={() => scroll('right')}
            className="flex items-center justify-center w-6 h-full border-l border-border/40 hover:bg-accent text-muted-foreground z-20 bg-background"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </AnimatePresence>
    </div>
  )
}