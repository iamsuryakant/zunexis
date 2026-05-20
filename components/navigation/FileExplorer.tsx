"use client";

import { useState, useEffect, useRef } from "react";
import { useExecutionStore } from "@/stores/useExecutionStore";
import {
  File,
  Folder as FolderIcon,
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  Pencil,
} from "lucide-react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";

// --- Main Component ---
export default function FileExplorer() {
  const {
    files,
    creating,
    setCreating,
    createNode,
    activeFileId,
    selectedNodeId,
    setSelectedNode,
    openFile,
    toggleFolder,
    deleteNode,
    renameNode,
  } = useExecutionStore();

  const [newName, setNewName] = useState("");
  const [createError, setCreateError] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [renameError, setRenameError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const createConfirmed = useRef(false);
  const renameConfirmed = useRef(false);

  const rootItems = files.filter((f) => f.parentId === "root");
  const getChildren = (parentId: string) =>
    files.filter((f) => f.parentId === parentId);

  const handleCreate = () => {
    if (!newName.trim() || !creating) return;
    if (createConfirmed.current) return;

    const id = nanoid();
    const result = createNode(
      id,
      creating.parentId,
      newName.trim(),
      creating.type,
    );
    if (!result.success) {
      setCreateError(result.error || "Could not create item.");
      return;
    }

    createConfirmed.current = true;
    setCreating(null);
    setNewName("");
    setCreateError("");
    setSelectedNode(id);
  };

  useEffect(() => {
    createConfirmed.current = false;
  }, [creating]);

  useEffect(() => {
    renameConfirmed.current = false;
  }, [renaming]);

  const handleDelete = (id: string) => {
    const node = files.find((file) => file.id === id);
    if (!node) return;
    setDeleteTarget(node);
  };

  const beginRename = (id: string, name: string) => {
    setCreating(null);
    setCreateError("");
    setRenaming({ id, name });
    setRenameError("");
  };

  const handleRename = () => {
    if (!renaming) return;
    if (renameConfirmed.current) return;

    const result = renameNode(renaming.id, renaming.name);
    if (!result.success) {
      setRenameError(result.error || "Could not rename item.");
      return;
    }

    renameConfirmed.current = true;
    setRenaming(null);
    setRenameError("");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteNode(deleteTarget.id);
    setDeleteTarget(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      // FIX:
      // Ignore Monaco editor keyboard events
      if (
        target?.closest(".monaco-editor") ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (!selectedNodeId) return;

      const node = files.find((file) => file.id === selectedNodeId);

      if (!node) return;

      // Rename shortcut
      if (e.key === "F2") {
        e.preventDefault();
        beginRename(node.id, node.name);
        return;
      }

      // Explorer Enter shortcut
      if (e.key === "Enter") {
        e.preventDefault();

        if (node.type === "file") {
          openFile(node.id);
        }

        if (node.type === "folder") {
          toggleFolder(node.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [files, selectedNodeId, openFile, toggleFolder, beginRename]);

  return (
    <div className="flex flex-col h-full bg-transparent text-[13px] py-2">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Creation input for the root level */}
        {creating && creating.parentId === "root" && (
          <CreationInput
            type={creating.type}
            value={newName}
            onChange={(value: string) => {
              setNewName(value);
              setCreateError("");
            }}
            onConfirm={handleCreate}
            onCancel={() => {
              setCreating(null);
              setCreateError("");
            }}
            error={createError}
            depth={0}
            createConfirmed={createConfirmed}
          />
        )}

        {rootItems.length === 0 && !creating && (
          <ExplorerEmptyState
            onCreateFile={() => setCreating({ parentId: "root", type: "file" })}
            onCreateFolder={() =>
              setCreating({ parentId: "root", type: "folder" })
            }
          />
        )}

        {rootItems.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            depth={0}
            activeFileId={activeFileId}
            selectedNodeId={selectedNodeId}
            getChildren={getChildren}
            onSelect={setSelectedNode}
            onOpen={openFile}
            onToggle={toggleFolder}
            onDelete={handleDelete}
            onRename={beginRename}
            onCreate={(parentId: string, type: "file" | "folder") =>
              setCreating({ parentId, type })
            }
            creating={creating}
            renaming={renaming}
            setRenaming={setRenaming}
            renameError={renameError}
            setRenameError={setRenameError}
            handleRename={handleRename}
            newName={newName}
            setNewName={setNewName}
            setCreateError={setCreateError}
            createError={createError}
            handleCreate={handleCreate}
            renameConfirmed={renameConfirmed}
            onRemove={() => {
              setCreating(null);
              setCreateError("");
            }}
          />
        ))}
      </div>
      {deleteTarget && (
        <DeleteConfirmModal
          node={deleteTarget}
          childCount={
            files.filter((file) => file.parentId === deleteTarget.id).length
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

// --- Sub-Component: TreeNode ---
// This is what was missing from your scope!
function TreeNode({
  item,
  depth,
  activeFileId,
  selectedNodeId,
  getChildren,
  onSelect,
  onOpen,
  onToggle,
  onDelete,
  onRename,
  onCreate,
  creating,
  renaming,
  setRenaming,
  renameError,
  setRenameError,
  handleRename,
  newName,
  setNewName,
  setCreateError,
  createError,
  handleCreate,
  renameConfirmed,
  onRemove,
}: any) {
  const [expanded, setExpanded] = useState(true);
  const children = getChildren(item.id);
  const isFolder = item.type === "folder";
  const isCreatingChild = creating?.parentId === item.id;
  const isRenaming = renaming?.id === item.id;
  const isActive = activeFileId === item.id;
  const isSelected = selectedNodeId === item.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.id);
    if (isFolder) {
      setExpanded(!expanded);
      onToggle(item.id);
    } else {
      onOpen(item.id);
    }
  };

  return (
    <div className="relative">
      {isRenaming ? (
        <RenameInput
          item={item}
          depth={depth}
          value={renaming.name}
          error={renameError}
          onChange={(value: string) => {
            setRenaming({ id: item.id, name: value });
            setRenameError("");
          }}
          onConfirm={handleRename}
          onCancel={() => {
            setRenaming(null);
            setRenameError("");
          }}
          renameConfirmed={renameConfirmed}
        />
      ) : (
        <div
          onClick={handleToggle}
          className={`
            group relative flex items-center h-9 cursor-pointer select-none px-2 transition-colors
            ${isActive || isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"}
          `}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {(isActive || isSelected) && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
          )}

          <span className="w-4 h-4 mr-1 flex items-center justify-center shrink-0">
            {isFolder &&
              (expanded ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground/50" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              ))}
          </span>

          {isFolder ? (
            <FolderIcon
              className={`w-4 h-4 mr-2 shrink-0 ${expanded ? "text-blue-400" : "text-blue-400/70"}`}
              fill={expanded ? "currentColor" : "none"}
            />
          ) : (
            <File className="w-4 h-4 mr-2 shrink-0 text-green-600 dark:text-green-500" />
          )}

          <span className="truncate">{item.name}</span>

          <div className="ml-auto flex items-center gap-0.5 pr-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            {isFolder && (
              <>
                <RowAction
                  title="New file"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onCreate(item.id, "file");
                  }}
                  icon={<FilePlus size={12} />}
                />
                <RowAction
                  title="New folder"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onCreate(item.id, "folder");
                  }}
                  icon={<FolderPlus size={12} />}
                />
              </>
            )}
            <RowAction
              title="Rename"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onRename(item.id, item.name);
              }}
              icon={<Pencil size={12} />}
            />
            <RowAction
              title="Delete"
              danger
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              icon={<Trash2 size={12} />}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isFolder && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div
              className="absolute left-[19px] top-8 bottom-0 w-[1px] bg-border/20"
              style={{ left: `${depth * 12 + 19}px` }}
            />

            {children.map((child: any) => (
              <TreeNode
                key={child.id}
                item={child}
                depth={depth + 1}
                activeFileId={activeFileId}
                selectedNodeId={selectedNodeId}
                {...{
                  getChildren,
                  onSelect,
                  onOpen,
                  onToggle,
                  onDelete,
                  onRename,
                  onCreate,
                  creating,
                  renaming,
                  setRenaming,
                  renameError,
                  setRenameError,
                  handleRename,
                  newName,
                  setNewName,
                  setCreateError,
                  createError,
                  handleCreate,
                  onRemove,
                }}
              />
            ))}

            {isCreatingChild && (
              <CreationInput
                type={creating.type}
                value={newName}
                onChange={(value: string) => {
                  setNewName(value);
                  setCreateError("");
                }}
                onConfirm={handleCreate}
                onCancel={onRemove}
                error={createError}
                depth={depth + 1}
                createConfirmed={createConfirmed}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RowAction({ title, icon, onClick, danger = false }: any) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-md transition ${
        danger
          ? "text-muted-foreground/60 hover:bg-red-500/15 hover:text-red-500"
          : "text-muted-foreground/60 hover:bg-background/80 hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
}

function ExplorerEmptyState({
  onCreateFile,
  onCreateFolder,
}: {
  onCreateFile: () => void;
  onCreateFolder: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-5 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-muted-foreground">
        <FolderIcon size={18} strokeWidth={1.5} />
      </div>
      <p className="mt-3 text-xs font-semibold text-foreground/70">
        No files yet
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/55">
        Create a file or folder to start building your workspace.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onCreateFile}
          className="h-8 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground"
        >
          File
        </button>
        <button
          onClick={onCreateFolder}
          className="h-8 rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Folder
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ node, childCount, onCancel, onConfirm }: any) {
  const isFolder = node.type === "folder";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[280px] rounded-lg border border-border bg-background p-4 shadow-2xl">
        <div className="flex items-center gap-2 text-foreground">
          {isFolder ? (
            <FolderIcon className="h-4 w-4 text-blue-400" />
          ) : (
            <File className="h-4 w-4 text-green-500" />
          )}
          <h3 className="text-sm font-semibold">
            Delete {isFolder ? "folder" : "file"}?
          </h3>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {isFolder
            ? `This will delete "${node.name}"${childCount > 0 ? ` and ${childCount} item${childCount === 1 ? "" : "s"} inside it` : ""}.`
            : `This will delete "${node.name}".`}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-8 rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 rounded-md bg-red-500 px-3 text-xs font-semibold text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameInput({
  item,
  depth,
  value,
  error,
  onChange,
  onConfirm,
  onCancel,
  renameConfirmed,
}: any) {
  return (
    <div className="px-3 py-1" style={{ paddingLeft: `${depth * 12 + 24}px` }}>
      <div className="flex h-8 items-center">
        {item.type === "folder" ? (
          <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
        ) : (
          <File className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
        )}
        <input
          autoFocus
          className={`bg-accent/50 border rounded px-1.5 py-0.5 w-full outline-none text-[12px] ring-2 ${
            error
              ? "border-red-500/60 ring-red-500/10"
              : "border-primary/30 ring-primary/10"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm();
            if (e.key === "Escape") onCancel();
          }}
          onBlur={() => {
            if (renameConfirmed?.current) return;
            if (value.trim() === item.name) onCancel();
            else onConfirm();
          }}
        />
      </div>
      {error && (
        <p className="ml-6 pr-2 text-[11px] leading-snug text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// --- Sub-Component: CreationInput ---
function CreationInput({
  type,
  value,
  onChange,
  onConfirm,
  onCancel,
  depth,
  error,
  createConfirmed,
}: any) {
  return (
    <div className="px-3 py-1" style={{ paddingLeft: `${depth * 12 + 24}px` }}>
      <div className="flex items-center h-8">
        {type === "folder" ? (
          <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
        ) : (
          <File className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />
        )}
        <input
          autoFocus
          className={`bg-accent/50 border rounded px-1.5 py-0.5 w-full outline-none text-[12px] ring-2 ${
            error
              ? "border-red-500/60 ring-red-500/10"
              : "border-primary/30 ring-primary/10"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm();
            if (e.key === "Escape") onCancel();
          }}
          onBlur={() => {
            if (createConfirmed?.current) return;
            onCancel();
          }}
        />
      </div>
      {error && (
        <p className="ml-6 pr-2 text-[11px] leading-snug text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
