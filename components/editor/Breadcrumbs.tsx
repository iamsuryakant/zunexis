"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import { ChevronRight, Folder } from "lucide-react"
import { FileNode } from "@/core/filesystem/fileSystem"

export default function Breadcrumbs() {
  const { files, activeFileId } = useExecutionStore()

  // Accept string, null, or undefined
  const getPath = (fileId: string | null | undefined): FileNode[] => {
    if (!fileId) return []
    const file = files.find(f => f.id === fileId)
    if (!file) return []
    return [...getPath(file.parentId), file]
  }

  const path = getPath(activeFileId)

  if (path.length === 0) return null

  return (
    <div className="h-7 px-4 flex items-center gap-2 text-[11px] text-muted-foreground border-b bg-background/30 overflow-hidden">
      {path.map((node, i) => (
        <div key={node.id} className="flex items-center gap-2 shrink-0">
          {i !== 0 && <ChevronRight size={10} className="opacity-40" />}
          <div className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
            {node.type === "folder" && <Folder size={12} className="text-blue-400/70" />}
            <span>{node.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}