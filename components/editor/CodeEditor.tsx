"use client";

import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useExecutionStore } from "@/stores/useExecutionStore";
import { Play, Loader2, Zap, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Language Map for refined labeling
const LANGUAGE_META: Record<string, { label: string; color: string }> = {
  javascript: { label: "JavaScript", color: "text-yellow-500" },
  typescript: { label: "TypeScript", color: "text-blue-500" },
  python: { label: "Python", color: "text-blue-400" },
  java: { label: "Java", color: "text-orange-500" },
  cpp: { label: "C++", color: "text-pink-500" },
  c: { label: "C", color: "text-indigo-500" },
  go: { label: "Go", color: "text-cyan-500" },
  rust: { label: "Rust", color: "text-orange-600" },
  ruby: { label: "Ruby", color: "text-red-500" },
};

// All editor themes
const THEMES = {
  "github-light": {
    base: "vs" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d" },
      { token: "keyword", foreground: "d73a49" },
      { token: "string", foreground: "032f62" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#24292e",
      "editorLineNumber.foreground": "#959da5",
      "editorCursor.foreground": "#24292e",
      "editor.selectionBackground": "#c8c8fa",
    },
  },
  "github-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editorLineNumber.foreground": "6e7681",
      "editorCursor.foreground": "#c9d1d9",
      "editor.selectionBackground": "#388bfd33",
    },
  },
  "monokai": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715e", fontStyle: "italic" },
      { token: "keyword", foreground: "f92672" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
      { token: "variable", foreground: "a6e22e" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#f8f8f2",
      "editorLineNumber.foreground": "909087",
      "editorCursor.foreground": "#f8f8f0",
      "editor.selectionBackground": "#49483e",
    },
  },
  "dracula": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editorLineNumber.foreground": "6272a4",
      "editorCursor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
    },
  },
  "tomorrow-night": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "969896" },
      { token: "keyword", foreground: "c397d8" },
      { token: "string", foreground: "8abeb7" },
    ],
    colors: {
      "editor.background": "#1d1f21",
      "editor.foreground": "#c5c8c6",
      "editorLineNumber.foreground": "4a4a4a",
      "editorCursor.foreground": "#c5c8c6",
      "editor.selectionBackground": "#373b41",
    },
  },
  "solarized-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75" },
      { token: "keyword", foreground: "859900" },
      { token: "string", foreground: "2aa198" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editorLineNumber.foreground": "#586e75",
      "editorCursor.foreground": "#839496",
      "editor.selectionBackground": "#073642",
    },
  },
  "solarized-light": {
    base: "vs" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "93a1a1" },
      { token: "keyword", foreground: "859900" },
      { token: "string", foreground: "2aa198" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#657b83",
      "editorLineNumber.foreground": "#93a1a1",
      "editorCursor.foreground": "#657b83",
      "editor.selectionBackground": "#eee8d5",
    },
  },
  "twilight": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "5b5b5b" },
      { token: "keyword", foreground: "cda869" },
      { token: "string", foreground: "8f7a65" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "5b5b5b",
      "editorCursor.foreground": "#d4d4d4",
      "editor.selectionBackground": "#3c3c3c",
    },
  },
  "xcode": {
    base: "vs" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "008400" },
      { token: "keyword", foreground: "0000ff" },
      { token: "string", foreground: "c91b00" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#000000",
      "editorLineNumber.foreground": "#aaaaaa",
      "editorCursor.foreground": "#000000",
      "editor.selectionBackground": "#b4d7ff",
    },
  },
  "textmate": {
    base: "vs" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "006600" },
      { token: "keyword", foreground: "0066cc" },
      { token: "string", foreground: "c91b00" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#000000",
      "editorLineNumber.foreground": "#aaaaaa",
      "editorCursor.foreground": "#000000",
      "editor.selectionBackground": "#d0d0d0",
    },
  },
  "terminal": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "00ff00" },
      { token: "keyword", foreground: "ffff00" },
      { token: "string", foreground: "00ffff" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#ffffff",
      "editorLineNumber.foreground": "#808080",
      "editorCursor.foreground": "#ffffff",
      "editor.selectionBackground": "#ffffff33",
    },
  },
  "eclipse": {
    base: "vs" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "3f7f5f" },
      { token: "keyword", foreground: "7f0055" },
      { token: "string", foreground: "2a00ff" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#000000",
      "editorLineNumber.foreground": "#999999",
      "editorCursor.foreground": "#000000",
      "editor.selectionBackground": "#316ac5",
    },
  },
};

export default function CodeEditor() {
  const store = useExecutionStore();
  const files = store.files;
  const activeFileId = store.activeFileId;
  const updateFileCode = store.updateFileCode;
  const executeCode = store.executeCode;
  const statuses = store.statuses;
  const settings = store.settings;

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  const activeFile = files.find((f) => f.id === activeFileId);
  const status = activeFileId ? statuses[activeFileId] : "idle";
  const isRunning = status === "running";
  const langMeta = activeFile?.language ? LANGUAGE_META[activeFile.language] : null;

  // Sync with next-themes: light = github-light, dark = github-dark
  // Use mounted state to avoid SSR hydration issues
  const editorTheme = !mounted
    ? "github-light"
    : resolvedTheme === "dark"
    ? "github-dark"
    : "github-light";

  const handleCodeChange = (value: string | undefined) => {
    if (!activeFileId || value === undefined) return;
    updateFileCode(activeFileId, value);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {}, 1000);
  };

  if (!activeFile || activeFile.type !== "file") {
    return <EmptyState />;
  }

  const lineCount = activeFile.code?.split("\n").length || 0;

  return (
    <div className="h-full w-full bg-background relative group overflow-hidden flex flex-col">
      {/* Editor Header Bar */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className={cn("text-[11px] font-semibold", langMeta?.color || "text-muted-foreground")}>
            {langMeta?.label || activeFile.language?.toUpperCase() || "TEXT"}
          </span>
          <span className="text-[11px] text-muted-foreground/50">{activeFile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/40">{lineCount} lines</span>
          <Button
            size="sm"
            onClick={executeCode}
            disabled={isRunning}
            className="h-7 px-3 text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 rounded-md gap-1.5"
          >
            {isRunning ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Play size={11} fill="currentColor" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 w-full">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.code}
          theme={editorTheme}
          beforeMount={(monaco) => {
            Object.entries(THEMES).forEach(([name, theme]) => {
              monaco.editor.defineTheme(name, theme);
            });
          }}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: settings.fontSize || 14,
            fontFamily: settings.fontFamily || "JetBrains Mono, Fira Code, Consolas, monospace",
            lineHeight: settings.lineHeight || 1.6,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            renderLineHighlight: "line",
            fontLigatures: true,
            bracketPairColorization: { enabled: true },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              useShadows: false,
            },
            suggest: {
              showIcons: true,
              showFunctions: true,
              showVariables: true,
              showConstants: true,
            },
            quickSuggestions: { other: true, comments: false, strings: true },
            tabSize: 2,
            wordWrap: "on",
          }}
          onMount={(editor, monaco) => {
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              () => {
                executeCode();
              },
            );
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 shrink-0 flex items-center justify-between px-4 border-t border-border/30 bg-muted/10 text-[10px] text-muted-foreground/50">
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>{settings.editorTheme || "github-light"}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-accent/30 flex items-center justify-center mb-6 relative">
          <FileCode size={32} className="text-muted-foreground/30" />
          <Zap size={12} className="absolute top-3 right-3 text-primary animate-pulse" />
        </div>
        <h3 className="text-base font-semibold mb-1">No File Open</h3>
        <p className="text-xs text-muted-foreground/50 text-center">
          Select a file from the explorer
        </p>
      </motion.div>
    </div>
  );
}