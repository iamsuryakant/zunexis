"use client"

import { useState, useEffect } from "react"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { File, Folder as FolderIcon, ChevronRight, ChevronDown, FilePlus, FolderPlus, Trash2 } from "lucide-react"
import { nanoid } from "nanoid"
import { motion, AnimatePresence } from "framer-motion"

// --- Main Component ---
export default function FileExplorer() {
  const { 
    files, 
    creating, 
    setCreating, 
    createNode, 
    activeFileId, 
    openFile, 
    toggleFolder, 
    deleteNode 
  } = useExecutionStore()
  
  const [newName, setNewName] = useState("")

  const rootItems = files.filter(f => f.parentId === 'root')
  const getChildren = (parentId: string) => files.filter(f => f.parentId === parentId)

  const handleCreate = () => {
    if (!newName.trim() || !creating) return
    createNode(nanoid(), creating.parentId, newName.trim(), creating.type)
    setCreating(null)
    setNewName("")
  }

  useEffect(() => {
    if (!creating) setNewName("")
  }, [creating])

  return (
    <div className="flex flex-col h-full bg-transparent text-[13px] py-2">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Creation input for the root level */}
        {creating && creating.parentId === 'root' && (
          <CreationInput 
            type={creating.type} 
            value={newName} 
            onChange={setNewName} 
            onConfirm={handleCreate} 
            onCancel={() => setCreating(null)} 
            depth={0}
          />
        )}

        {rootItems.map(item => (
          <TreeNode
            key={item.id}
            item={item}
            depth={0}
            isActive={activeFileId === item.id}
            getChildren={getChildren}
            onOpen={openFile}
            onToggle={toggleFolder}
            onDelete={deleteNode}
            onCreate={(parentId: string, type: 'file' | 'folder') => setCreating({ parentId, type })}
            creating={creating}
            newName={newName}
            setNewName={setNewName}
            handleCreate={handleCreate}
            onRemove={() => setCreating(null)}
          />
        ))}
      </div>
    </div>
  )
}

// --- Sub-Component: TreeNode ---
// This is what was missing from your scope!
function TreeNode({ 
  item, depth, isActive, getChildren, onOpen, onToggle, onDelete, 
  onCreate, creating, newName, setNewName, handleCreate, onRemove 
}: any) {
  const [expanded, setExpanded] = useState(true)
  const children = getChildren(item.id)
  const isFolder = item.type === 'folder'
  const isCreatingChild = creating?.parentId === item.id

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFolder) {
      setExpanded(!expanded)
      onToggle(item.id)
    } else {
      onOpen(item.id)
    }
  }

  return (
    <div className="relative">
      <div
        onClick={handleToggle}
        className={`
          group relative flex items-center h-8 cursor-pointer select-none px-2 transition-colors
          ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'}
        `}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />}

        <span className="w-4 h-4 mr-1 flex items-center justify-center">
          {isFolder && (
            expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground/50" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          )}
        </span>

        {isFolder ? (
          <FolderIcon className={`w-4 h-4 mr-2 shrink-0 ${expanded ? 'text-blue-400' : 'text-blue-400/70'}`} fill={expanded ? "currentColor" : "none"} />
        ) : (
          <File className="w-4 h-4 mr-2 shrink-0 text-emerald-500/70" />
        )}

        <span className="truncate">{item.name}</span>

        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
          {isFolder && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onCreate(item.id, 'file') }} className="p-1 hover:bg-background/80 rounded"><FilePlus size={12} /></button>
              <button onClick={(e) => { e.stopPropagation(); onCreate(item.id, 'folder') }} className="p-1 hover:bg-background/80 rounded"><FolderPlus size={12} /></button>
            </>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id) }} className="p-1 hover:bg-destructive/20 hover:text-destructive rounded"><Trash2 size={12} /></button>
        </div>
      </div>

      <AnimatePresence>
        {isFolder && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="absolute left-[19px] top-8 bottom-0 w-[1px] bg-border/20" style={{ left: `${depth * 12 + 19}px` }} />
            
            {children.map((child: any) => (
              <TreeNode key={child.id} item={child} depth={depth + 1} isActive={isActive} {...{ getChildren, onOpen, onToggle, onDelete, onCreate, creating, newName, setNewName, handleCreate, onRemove }} />
            ))}
            
            {isCreatingChild && (
              <CreationInput 
                type={creating.type} 
                value={newName} 
                onChange={setNewName} 
                onConfirm={handleCreate} 
                onCancel={onRemove} 
                depth={depth + 1}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Sub-Component: CreationInput ---
function CreationInput({ type, value, onChange, onConfirm, onCancel, depth }: any) {
  return (
    <div className="flex items-center h-8 px-3" style={{ paddingLeft: `${depth * 12 + 24}px` }}>
      {type === 'folder' ? 
        <FolderIcon className="w-4 h-4 mr-2 text-blue-400 fill-blue-400/20" /> : 
        <File className="w-4 h-4 mr-2 text-emerald-500" />
      }
      <input
        autoFocus
        className="bg-accent/50 border border-primary/30 rounded px-1.5 py-0.5 w-full outline-none text-[12px] ring-2 ring-primary/10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onConfirm()
          if (e.key === 'Escape') onCancel()
        }}
        onBlur={() => value === "" ? onCancel() : onConfirm()}
      />
    </div>
  )
}