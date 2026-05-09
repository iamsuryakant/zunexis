"use client"

import * as React from "react"
import { useExecutionStore } from "@/stores/useExecutionStore"
import {
  FileCode,
  Search,
  Terminal,
  Play,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCommandPalette } from "@/components/providers/command-palette-provider"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function CommandPalette() {
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const { files, openFile, executeCode, toggleConsole } = useExecutionStore()
  const { setTheme } = useTheme()
  const { isOpen, close } = useCommandPalette()

  const commands = React.useMemo(() => [
    { id: 'run', label: 'Run Code', icon: Play, action: executeCode, category: 'Actions', shortcut: '⌘↵' },
    { id: 'toggle-console', label: 'Toggle Console', icon: Terminal, action: toggleConsole, category: 'Actions', shortcut: '⌘J' },
    { id: 'theme-light', label: 'Light Theme', icon: Sun, action: () => setTheme('light'), category: 'Appearance' },
    { id: 'theme-dark', label: 'Dark Theme', icon: Moon, action: () => setTheme('dark'), category: 'Appearance' },
  ], [executeCode, toggleConsole, setTheme])

  const allItems = React.useMemo(() => {
    const fileItems = files.filter(f => f.type === 'file').map(file => ({
      id: file.id, label: file.name, icon: FileCode, action: () => openFile(file.id), category: 'Files', shortcut: undefined as string | undefined,
    }))
    return [...commands, ...fileItems]
  }, [files, commands, openFile])

  const filteredItems = React.useMemo(() => {
    const s = search.toLowerCase().trim()
    return s ? allItems.filter(item => item.label.toLowerCase().includes(s)) : allItems
  }, [search, allItems])

  React.useEffect(() => setSelectedIndex(0), [search])

  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action()
          close()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-2 sm:px-4">
          {/* Flat backdrop - stable and non-distracting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-sm sm:max-w-xl bg-background border border-border/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] rounded-xl overflow-hidden"
          >
            {/* 1. COMPLETELY BORDERLESS INPUT AREA */}
            <div className="flex items-center gap-4 px-5 h-14 bg-background">
              <Search size={18} className="text-muted-foreground/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What do you need?"
                className="flex-1 bg-transparent text-[16px] outline-none border-none ring-0 focus:ring-0 placeholder:text-muted-foreground/30"
                autoFocus
              />
            </div>

            {/* 2. NAVIGATION LIST */}
            <div className="max-h-[320px] overflow-y-auto pb-2 scrollbar-hide">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-muted-foreground/40">No matches found</div>
              ) : (
                <div className="px-2">
                  {filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => { item.action(); close(); }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 h-10 rounded-md transition-all text-left group",
                          isSelected 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon 
                            size={16} 
                            className={cn(isSelected ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-foreground")} 
                          />
                          <span className="text-[13px] font-medium tracking-tight">
                            {item.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                           <span className={cn(
                             "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                             isSelected ? "bg-primary-foreground/10 text-primary-foreground" : "bg-muted text-muted-foreground/30"
                           )}>
                             {item.category}
                           </span>
                          {item.shortcut && (
                            <kbd className={cn(
                              "text-[10px] font-mono",
                              isSelected ? "text-primary-foreground/60" : "text-muted-foreground/20"
                            )}>
                              {item.shortcut}
                            </kbd>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* 3. MINIMAL STATUS FOOTER */}
            <div className="px-5 py-3 border-t border-border/40 flex justify-between items-center bg-muted/5">
              <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                 <div className="flex items-center gap-1.5">
                   <span className="border border-border/60 px-1 rounded">ENTER</span>
                   <span>EXECUTE</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <span className="border border-border/60 px-1 rounded">ESC</span>
                   <span>CLOSE</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}