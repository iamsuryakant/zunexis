"use client"

import { useState } from "react"
import { useExecutionStore } from "@/stores/useExecutionStore"
import { FileNode } from "@/core/filesystem/fileSystem"
import { Folder, FileCode, ChevronRight, ChevronDown, Trash2, Plus } from "lucide-react"
import { nanoid } from "nanoid"

export default function IDEExplorer() {
  const { files } = useExecutionStore()
  const [creating, setCreating] = useState<{ type: 'file'|'folder', targetId: string } | null>(null)

  const rootFiles = files.filter(f => f.parentId === null || f.parentId === 'root')

  const triggerCreate = (type: 'file'|'folder', targetId: string) => {
    setCreating({ type, targetId })
  }

  return (
    <div className="flex flex-col h-full bg-background text-slate-300 border-r border-white/5 font-sans">
      <div className="h-12 px-4 flex items-center justify-between border-b border-white/5 bg-background/50">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Project</span>
        <div className="flex gap-1">
          <button onClick={() => triggerCreate('file', 'root')} className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white" title="New File"><FileCode size={14} /></button>
          <button onClick={() => triggerCreate('folder', 'root')} className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white" title="New Folder"><Folder size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {creating && creating.targetId === 'root' && (
          <CreationForm type={creating.type} parentId="root" onClose={() => setCreating(null)} />
        )}
        {rootFiles.map(node => (
          <TreeNode key={node.id} node={node} depth={0} creating={creating} triggerCreate={triggerCreate} onClose={() => setCreating(null)} />
        ))}
      </div>
    </div>
  )
}

function TreeNode({ node, depth, creating, triggerCreate, onClose }: { node: FileNode, depth: number, creating: { type: 'file'|'folder', targetId: string } | null, triggerCreate: (type: 'file'|'folder', targetId: string) => void, onClose: ()=>void }) {
  const { files, activeFileId, setActiveFile, toggleFolder, deleteNode } = useExecutionStore()
  const isFolder = node.type === "folder"
  const isActive = activeFileId === node.id
  const children = files.filter(f => f.parentId === node.id)

  return (
    <div className="flex flex-col">
      <div
        onClick={() => isFolder ? toggleFolder(node.id) : setActiveFile(node.id)}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={`group flex items-center justify-between pr-3 py-1.5 text-[13px] cursor-pointer border-l-2 transition-colors ${isActive ? "bg-primary/10 text-white border-primary" : "border-transparent hover:bg-white/5 text-slate-400"}`}
      >
        <div className="flex items-center gap-2 truncate">
          {isFolder ? (node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div className="w-3.5" />}
          {isFolder ? <Folder size={15} className="text-blue-400" /> : <FileCode size={15} className="text-emerald-400" />}
          <span className="truncate">{node.name}</span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center">
          {isFolder && (
            <button onClick={(e) => { e.stopPropagation(); triggerCreate('file', node.id); }} className="p-1 hover:text-white"><Plus size={12} /></button>
          )}
          <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="p-1 hover:text-red-400"><Trash2 size={12} /></button>
        </div>
      </div>

      {isFolder && node.isOpen && (
        <div className="flex flex-col">
          {creating && creating.targetId === node.id && (
            <CreationForm type={creating.type} parentId={node.id} depth={depth + 1} onClose={onClose} />
          )}
          {children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} creating={creating} triggerCreate={triggerCreate} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  )
}

function CreationForm({ type, parentId, depth = 0, onClose }: { type: 'file'|'folder', parentId: string, depth?: number, onClose: ()=>void }) {
  const [val, setVal] = useState("")
  const { createNode } = useExecutionStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (val.trim()) {
      const id = nanoid();
      createNode(id, parentId, val, type === 'file' ? 'file' : 'folder')
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} style={{ paddingLeft: `${depth * 12 + 28}px` }} className="py-1 pr-4">
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Escape' && onClose()}
        onBlur={onClose}
        placeholder={type === 'file' ? "filename.js" : "folder name"}
        className="w-full bg-card border border-primary/50 text-white text-xs px-2 py-1 rounded outline-none"
      />
    </form>
  )
}
