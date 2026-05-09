"use client"

import { useState, useMemo } from "react"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { Search, FileText, CornerDownRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function GlobalSearch() {
  const [query, setQuery] = useState("")
  const { files, openFile } = useExecutionStore()

  // High-performance search logic
  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (q.length < 2) return []

    return files.reduce((acc: any[], file) => {
      if (file.type !== 'file') return acc

      const nameMatch = file.name.toLowerCase().includes(q)
      const contentMatch = file.code?.toLowerCase().includes(q)

      if (nameMatch || contentMatch) {
        acc.push({
          ...file,
          matchType: nameMatch && !contentMatch ? 'name' : 'content'
        })
      }
      return acc
    }, [])
  }, [query, files])

  return (
    <div className="flex flex-col h-full bg-transparent select-none">
      {/* Search Input Area */}
      <div className="p-3 space-y-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files or symbols..."
            className="w-full bg-accent/30 border border-border/40 rounded-lg py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">
            {query.length >= 2 ? `${results.length} results found` : "Enter keywords..."}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {query.length > 0 && query.length < 2 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-10 text-center text-muted-foreground/40 text-xs italic"
            >
              Keep typing...
            </motion.div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((file) => (
                <SearchResultCard 
                  key={file.id} 
                  file={file} 
                  query={query} 
                  onClick={() => openFile(file.id)} 
                />
              ))}
            </div>
          ) : query.length >= 2 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-10 text-center space-y-2"
            >
              <Search className="mx-auto h-8 w-8 text-muted-foreground/20 stroke-[1px]" />
              <p className="text-xs text-muted-foreground/40">No matches found for "{query}"</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SearchResultCard({ file, query, onClick }: any) {
  // Extracting the snippet logic
  const snippet = useMemo(() => {
    if (!file.code) return null
    const index = file.code.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return null

    const start = Math.max(0, index - 20)
    const end = Math.min(file.code.length, index + query.length + 40)
    let text = file.code.substring(start, end).replace(/\n/g, " ")
    
    return {
      before: text.substring(0, index - start),
      match: text.substring(index - start, index - start + query.length),
      after: text.substring(index - start + query.length)
    }
  }, [file.code, query])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group flex flex-col p-2 rounded-md hover:bg-accent/50 cursor-pointer border border-transparent hover:border-border/40 transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-2 mb-1">
        <FileText size={14} className="text-blue-400 opacity-80" />
        <span className="text-[13px] font-medium text-foreground/90 truncate italic">
          {file.name}
        </span>
        {file.matchType === 'name' && (
          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20 ml-auto">
            Filename
          </span>
        )}
      </div>

      {snippet && (
        <div className="flex items-start gap-1.5 ml-1">
          <CornerDownRight size={12} className="text-muted-foreground/30 mt-1 shrink-0" />
          <div className="text-[11px] font-mono text-muted-foreground line-clamp-2 leading-relaxed break-all">
            <span className="opacity-50">...</span>
            {snippet.before}
            <span className="text-primary font-bold bg-primary/10 px-0.5 rounded">
              {snippet.match}
            </span>
            {snippet.after}
            <span className="opacity-50">...</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}