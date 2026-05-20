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
  Clock,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCommandPalette } from "@/components/providers/command-palette-provider"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function CommandPalette() {
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const { files, openFileIds, openFile, executeCode, toggleConsole } = useExecutionStore()
  const { setTheme } = useTheme()
  const { isOpen, close } = useCommandPalette()

  const commands = React.useMemo(() => [
    { id: 'run', label: 'Run Code', icon: Play, action: executeCode, category: 'Actions', shortcut: '⌘↵' },
    { id: 'toggle-console', label: 'Toggle Console', icon: Terminal, action: toggleConsole, category: 'Actions', shortcut: '⌘J' },
    { id: 'theme-light', label: 'Light Theme', icon: Sun, action: () => setTheme('light'), category: 'Appearance' },
    { id: 'theme-dark', label: 'Dark Theme', icon: Moon, action: () => setTheme('dark'), category: 'Appearance' },
  ], [executeCode, toggleConsole, setTheme])

  const allItems = React.useMemo(() => {
    const recentFileItems = openFileIds
      .slice()
      .reverse()
      .map(id => files.find(f => f.id === id && f.type === 'file'))
      .filter(Boolean)
      .map(file => ({
        id: `recent-${file!.id}`,
        label: file!.name,
        icon: Clock,
        action: () => openFile(file!.id),
        category: 'Recent',
        shortcut: undefined as string | undefined,
      }))
    const fileItems = files.filter(f => f.type === 'file').map(file => ({
      id: file.id, label: file.name, icon: FileCode, action: () => openFile(file.id), category: 'Files', shortcut: undefined as string | undefined,
    }))
    const recentIds = new Set(recentFileItems.map(item => item.id.replace("recent-", "")))
    return [...commands, ...recentFileItems, ...fileItems.filter(item => !recentIds.has(item.id))]
  }, [files, openFileIds, commands, openFile])

  const filteredItems = React.useMemo(() => {
    const s = search.toLowerCase().trim()
    return s ? allItems.filter(item => item.label.toLowerCase().includes(s)) : allItems
  }, [search, allItems])

  const groupedItems = React.useMemo(() => {
    const groups: Array<{ category: string; items: Array<(typeof filteredItems)[number] & { index: number }> }> = []
    filteredItems.forEach((item, index) => {
      const group = groups.find((entry) => entry.category === item.category)
      if (group) {
        group.items.push({ ...item, index })
      } else {
        groups.push({ category: item.category, items: [{ ...item, index }] })
      }
    })
    return groups
  }, [filteredItems])

  React.useEffect(() => {
    if (!isOpen) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  React.useEffect(() => setSelectedIndex(0), [search])

  React.useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1))
    }
  }, [filteredItems.length, selectedIndex])

  React.useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredItems.length) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selectedItem = filteredItems[selectedIndex]
        if (selectedItem) {
          selectedItem.action()
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
            className="relative w-full max-w-sm sm:max-w-xl bg-background border border-border/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden"
          >
            {/* 1. COMPLETELY BORDERLESS INPUT AREA */}
            <div className="flex items-center gap-4 px-5 h-14 bg-background border-b border-border/40">
              <Search size={18} className="text-muted-foreground/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const selectedItem = filteredItems[selectedIndex]
                    if (selectedItem) {
                      selectedItem.action()
                      close()
                    }
                  }
                }}
                placeholder="Search commands and files"
                className="flex-1 bg-transparent text-[16px] outline-none border-none ring-0 focus:ring-0 placeholder:text-muted-foreground/30"
                autoFocus
              />
            </div>

            {/* 2. NAVIGATION LIST */}
            <div className="max-h-[360px] overflow-y-auto py-2 scrollbar-hide">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="mx-auto h-7 w-7 text-muted-foreground/20" />
                  <p className="mt-3 text-[13px] font-medium text-muted-foreground/50">No matches found</p>
                </div>
              ) : (
                <div className="space-y-2 px-2">
                  {groupedItems.map((group) => (
                    <section key={group.category}>
                      <div className="px-2 pb-1 pt-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/45">
                          {group.category}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const isSelected = item.index === selectedIndex
                          return (
                            <button
                              key={item.id}
                              onMouseEnter={() => setSelectedIndex(item.index)}
                              onClick={() => { item.action(); close(); }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 h-10 rounded-md transition-all text-left group",
                                isSelected
                                  ? "bg-primary/15 text-primary"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <span className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded border",
                                  isSelected ? "border-primary/30 bg-primary/10 text-primary" : "border-border/50 bg-muted/20 text-muted-foreground/60"
                                )}>
                                  <item.icon size={14} />
                                </span>
                                <span className="truncate text-[13px] font-medium tracking-tight">
                                  {item.label}
                                </span>
                              </div>

                              {item.shortcut && (
                                <kbd className={cn(
                                  "ml-3 shrink-0 text-[10px] font-mono",
                                  isSelected ? "text-primary/70" : "text-muted-foreground/25"
                                )}>
                                  {item.shortcut}
                                </kbd>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  ))}
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
