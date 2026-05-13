"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import FileExplorer from "./FileExplorer"
import GlobalSearch from "./GlobalSearch"
import SettingsPanel from "../editor/SettingsPanel"
import { motion, AnimatePresence } from "framer-motion"
import { FilePlus, FolderPlus, Files, Search, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  width?: number;
}

export default function Sidebar({ width = 256 }: SidebarProps) {
  const { sidebarView, setSidebarView, setCreating } = useExecutionStore()

  const viewLabels: Record<string, string> = {
    explorer: "Explorer",
    search: "Search",
    settings: "Editor Settings",
  }

  const handleViewClick = (view: string) => {
    // Toggle: if clicking on already active view, close it
    if (sidebarView === view) {
      setSidebarView("")
    } else {
      setSidebarView(view)
    }
  }

  return (
    <div className="flex h-full w-full">
      {/* --- Activity Bar (Icon Strip) --- */}
      <nav className="w-12 flex flex-col items-center py-4 gap-4 bg-background border-r border-border/40 z-20">
        <ActivityIcon
          active={sidebarView === 'explorer'}
          onClick={() => handleViewClick('explorer')}
          icon={<Files size={20} />}
          label="Explorer"
        />
        <ActivityIcon
          active={sidebarView === 'search'}
          onClick={() => handleViewClick('search')}
          icon={<Search size={20} />}
          label="Search"
        />
        <div className="flex-1" />
        <ActivityIcon
          active={sidebarView === 'settings'}
          onClick={() => handleViewClick('settings')}
          icon={<Settings size={20} />}
          label="Settings"
        />
      </nav>

      {/* --- Sidebar Panel --- */}
      {sidebarView && (
        <aside
          className="flex flex-col h-full bg-background/50 backdrop-blur-sm border-r border-border/40 select-none overflow-hidden"
          style={{ width }}
        >
        {/* Dynamic Header */}
        <div className="flex h-12 items-center justify-between px-4 border-b border-border/10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            {viewLabels[sidebarView] || "Panel"}
          </span>

          <AnimatePresence mode="wait">
            {sidebarView === 'explorer' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1"
              >
                <HeaderAction
                  onClick={() => setCreating({ parentId: 'root', type: 'file' })}
                  icon={<FilePlus size={14} />}
                />
                <HeaderAction
                  onClick={() => setCreating({ parentId: 'root', type: 'folder' })}
                  icon={<FolderPlus size={14} />}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sidebarView}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.15, ease: "circOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {sidebarView === 'explorer' && <FileExplorer />}
              {sidebarView === 'search' && <GlobalSearch />}
              {sidebarView === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>
      )}
    </div>
  )
}

function ActivityIcon({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "relative group p-2 rounded-xl transition-all duration-300",
        active ? "text-primary bg-primary/10" : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent/50"
      )}
    >
      {icon}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
          style={{ left: -12 }}
        />
      )}
    </button>
  )
}

function HeaderAction({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg text-muted-foreground/60 hover:bg-white/[0.05] hover:text-foreground transition-all active:scale-90"
    >
      {icon}
    </button>
  )
}