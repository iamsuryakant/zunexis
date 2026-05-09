"use client";

import { useState, useMemo } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useExecutionStore } from "@/stores/useExecutionStore";
import { FileCode, Layers } from "lucide-react";

const THEMES: Record<string, object> = {
  "github-light": {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "6a737d" }, { token: "keyword", foreground: "d73a49" }, { token: "string", foreground: "032f62" }],
    colors: { "editor.background": "#ffffff", "editor.foreground": "#24292e", "editorLineNumber.foreground": "#959da5" },
  },
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "8b949e" }, { token: "keyword", foreground: "ff7b72" }, { token: "string", foreground: "a5d6ff" }],
    colors: { "editor.background": "#0d1117", "editor.foreground": "#c9d1d9", "editorLineNumber.foreground": "6e7681" },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "75715e", fontStyle: "italic" }, { token: "keyword", foreground: "f92672" }, { token: "string", foreground: "e6db74" }],
    colors: { "editor.background": "#272822", "editor.foreground": "#f8f8f2", "editorLineNumber.foreground": "909087" },
  },
  dracula: {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "6272a4" }, { token: "keyword", foreground: "ff79c6" }, { token: "string", foreground: "f1fa8c" }],
    colors: { "editor.background": "#282a36", "editor.foreground": "#f8f8f2", "editorLineNumber.foreground": "6272a4" },
  },
  "tomorrow-night": {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "969896" }, { token: "keyword", foreground: "c397d8" }, { token: "string", foreground: "8abeb7" }],
    colors: { "editor.background": "#1d1f21", "editor.foreground": "#c5c8c6", "editorLineNumber.foreground": "4a4a4a" },
  },
  "solarized-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "586e75" }, { token: "keyword", foreground: "859900" }, { token: "string", foreground: "2aa198" }],
    colors: { "editor.background": "#002b36", "editor.foreground": "#839496", "editorLineNumber.foreground": "#586e75" },
  },
  "solarized-light": {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "93a1a1" }, { token: "keyword", foreground: "859900" }, { token: "string", foreground: "2aa198" }],
    colors: { "editor.background": "#fdf6e3", "editor.foreground": "#657b83", "editorLineNumber.foreground": "#93a1a1" },
  },
  twilight: {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "5b5b5b" }, { token: "keyword", foreground: "cda869" }, { token: "string", foreground: "8f7a65" }],
    colors: { "editor.background": "#1e1e1e", "editor.foreground": "#d4d4d4", "editorLineNumber.foreground": "5b5b5b" },
  },
  xcode: {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "008400" }, { token: "keyword", foreground: "0000ff" }, { token: "string", foreground: "c91b00" }],
    colors: { "editor.background": "#ffffff", "editor.foreground": "#000000", "editorLineNumber.foreground": "#aaaaaa" },
  },
  textmate: {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "006600" }, { token: "keyword", foreground: "0066cc" }, { token: "string", foreground: "c91b00" }],
    colors: { "editor.background": "#ffffff", "editor.foreground": "#000000", "editorLineNumber.foreground": "#aaaaaa" },
  },
  terminal: {
    base: "vs-dark",
    inherit: true,
    rules: [{ token: "comment", foreground: "00ff00" }, { token: "keyword", foreground: "ffff00" }, { token: "string", foreground: "00ffff" }],
    colors: { "editor.background": "#000000", "editor.foreground": "#ffffff", "editorLineNumber.foreground": "#808080" },
  },
  eclipse: {
    base: "vs",
    inherit: true,
    rules: [{ token: "comment", foreground: "3f7f5f" }, { token: "keyword", foreground: "7f0055" }, { token: "string", foreground: "2a00ff" }],
    colors: { "editor.background": "#ffffff", "editor.foreground": "#000000", "editorLineNumber.foreground": "#999999" },
  },
};

export default function CodeEditor() {
  const { files, activeFileId, updateFileCode, executeCode, settings } = useExecutionStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  if (typeof window !== "undefined" && !mounted) {
    setMounted(true);
  }

  const activeFile = files.find((f) => f.id === activeFileId);
  const currentTheme = useMemo(() => {
    if (!mounted) return "github-light";
    if (settings.editorTheme && THEMES[settings.editorTheme]) return settings.editorTheme;
    return resolvedTheme === "dark" ? "github-dark" : "github-light";
  }, [mounted, resolvedTheme, settings.editorTheme]);

  if (!activeFile || activeFile.type !== "file" || !activeFileId) return <EmptyState />;

  return (
    <div className="h-full w-full bg-background relative flex flex-col overflow-hidden">
      {/* CLEAN EDITOR HEADER: Information Only */}
      <div className="h-9 shrink-0 flex items-center justify-between px-4 border-b border-border/40 bg-muted/5 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileCode size={14} className="text-muted-foreground/40" />
            <span className="text-[11px] font-bold text-foreground/70 tracking-tight">
              {activeFile.name}
            </span>
          </div>
          <div className="h-3 w-px bg-border/40" />
          <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
            {activeFile.language}
          </span>
        </div>

        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono">UTF-8</span>
          <Layers size={12} />
        </div>
      </div>

      {/* EDITOR WORKSPACE */}
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.code}
          theme={currentTheme}
          beforeMount={(monaco) => {
            Object.entries(THEMES).forEach(([name, theme]) => {
              const t = theme as { base: string; inherit: boolean; rules: object[]; colors: Record<string, string> };
              monaco.editor.defineTheme(name, {
                base: t.base,
                inherit: t.inherit,
                rules: t.rules,
                colors: t.colors,
              });
            });
          }}
          onChange={(val) => updateFileCode(activeFileId, val || "")}
          options={{
            fontSize: settings.fontSize || 14,
            fontFamily: settings.fontFamily || "JetBrains Mono, monospace",
            minimap: { enabled: false },
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6, useShadows: false },
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
          onMount={(editor, monaco) => {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => executeCode());
          }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background/50 italic text-muted-foreground/20 text-sm">
      Open a file to start coding
    </div>
  );
}