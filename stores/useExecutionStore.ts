import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FileNode } from "@/core/filesystem/fileSystem";
import { getLanguageByKey } from "@/lib/languages";
import { codeExecutor } from "@/lib/execution/executor";

export interface ExecutionMeta {
  time: number;
  memory: number;
}

export interface RunHistoryEntry {
  id: string;
  fileId: string;
  fileName: string;
  language: string;
  status: "success" | "error";
  outputPreview: string;
  time: number;
  memory: number;
  createdAt: number;
}

export interface Settings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  editorTheme: string;
  explicitEditorTheme: boolean;
}

export interface StoreType {
  // Sidebar & Layout
  sidebarView: string;
  setSidebarView: (view: string) => void;
  isConsoleCollapsed: boolean;
  toggleConsole: () => void;
  isConsoleExpanded: boolean;
  toggleConsoleExpanded: () => void;

  // Default Language
  defaultLanguage: string;
  setDefaultLanguage: (lang: string) => void;

  // File Creation State
  creating: { parentId: string; type: "file" | "folder" } | null;
  setCreating: (
    creating: { parentId: string; type: "file" | "folder" } | null,
  ) => void;

  // View Settings
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;

  // File System
  files: FileNode[];
  rootFolderId: string;

  // Editor State
  openFileIds: string[];
  activeFileId: string | null;
  selectedNodeId: string | null;

  // Execution
  outputs: Record<string, string[]>;
  metas: Record<string, ExecutionMeta>;
  statuses: Record<string, "idle" | "running" | "success" | "error">;
  runHistory: RunHistoryEntry[];

  // File Actions
  setActiveFile: (id: string) => void;
  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  toggleFolder: (id: string) => void;
  deleteNode: (id: string) => void;
  createNode: (
    id: string,
    parentId: string,
    name: string,
    type: string,
  ) => void;
  updateFileCode: (id: string, code: string) => void;

  // Execution Actions
  executeCode: () => Promise<void>;
  clearOutput: (id: string) => void;
  addOutput: (id: string, output: string) => void;
  setStatus: (
    id: string,
    status: "idle" | "running" | "success" | "error",
  ) => void;
  setMeta: (id: string, meta: ExecutionMeta) => void;
  addRunHistory: (entry: Omit<RunHistoryEntry, "id" | "createdAt">) => void;
  clearRunHistory: () => void;
}

const getDefaultCode = (lang: string): string => {
  const templates: Record<string, string> = {
    javascript: 'console.log("Hello Zunexis!");',
    python: 'print("Hello Zunexis!")',
    typescript: 'console.log("Hello Zunexis!");',
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Zunexis!");\n  }\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello Zunexis!" << std::endl;\n    return 0;\n}`,
    c: `#include <stdio.h>\n\nint main() {\n    printf("Hello Zunexis!\\n");\n    return 0;\n}`,
    go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Zunexis!")\n}`,
    rust: `fn main() {\n    println!("Hello Zunexis!");\n}`,
    ruby: `puts "Hello Zunexis!"`,
  };
  return templates[lang] || templates.javascript;
};

const extMap: Record<string, string> = {
  javascript: ".js",
  typescript: ".ts",
  python: ".py",
  java: ".java",
  cpp: ".cpp",
  c: ".c",
  go: ".go",
  rust: ".rs",
  ruby: ".rb",
};

export const useExecutionStore = create<StoreType>()(
  persist(
    (set, get) => ({
      // Sidebar & Layout
      sidebarView: "explorer",
      setSidebarView: (view: string) => set({ sidebarView: view }),
      isConsoleCollapsed: false,
      toggleConsole: () =>
        set((s) => ({ isConsoleCollapsed: !s.isConsoleCollapsed })),
      isConsoleExpanded: false,
      toggleConsoleExpanded: () =>
        set((s) => ({ isConsoleExpanded: !s.isConsoleExpanded })),

      // Default Language
      defaultLanguage: "javascript",
      setDefaultLanguage: (lang: string) => set({ defaultLanguage: lang }),

      // File Creation State
      creating: null,
      setCreating: (creating) => set({ creating }),

      settings: {
        fontSize: 14,
        fontFamily: "JetBrains Mono",
        lineHeight: 1.6,
        editorTheme: "",
        explicitEditorTheme: false,
      },

      // File System
      files: [
        {
          id: "root",
          name: "src",
          type: "folder",
          parentId: null,
          children: [],
          isOpen: true,
        },
      ],
      rootFolderId: "root",

      // Editor State
      openFileIds: [],
      activeFileId: null,
      selectedNodeId: null,

      // Execution
      outputs: {},
      metas: {},
      statuses: {},
      runHistory: [],

      // File Actions
      setActiveFile: (id: string) => set({ activeFileId: id }),

      openFile: (id: string) =>
        set((s) => {
          const isAlreadyOpen = s.openFileIds.includes(id);
          return {
            openFileIds: isAlreadyOpen ? s.openFileIds : [...s.openFileIds, id],
            activeFileId: id,
            selectedNodeId: id,
          };
        }),

      closeTab: (id: string) =>
        set((s) => {
          const newOpen = s.openFileIds.filter((fid) => fid !== id);
          return {
            openFileIds: newOpen,
            activeFileId:
              s.activeFileId === id
                ? newOpen.length > 0
                  ? newOpen[newOpen.length - 1]
                  : null
                : s.activeFileId,
          };
        }),

      toggleFolder: (id: string) =>
        set((s) => ({
          files: s.files.map((f) =>
            f.id === id ? { ...f, isOpen: !f.isOpen } : f,
          ),
        })),

      deleteNode: (id: string) =>
        set((s) => ({
          files: s.files.filter((f) => f.id !== id),
          openFileIds: s.openFileIds.filter((fid) => fid !== id),
          activeFileId: s.activeFileId === id ? null : s.activeFileId,
        })),

      updateSettings: (newSettings: any) =>
        set((state: any) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      createNode: (
        id: string,
        parentId: string,
        name: string,
        type: string,
      ) => {
        const { files, defaultLanguage } = get();
        let fileName = name;
        let fileLang = defaultLanguage;

        if (type === "file") {
          // Check if filename already has an extension - detect language from it
          const extMatch = name.match(/\.([^.]+)$/);
          if (extMatch) {
            // User provided an extension - detect language from extension
            const ext = extMatch[1].toLowerCase();
            const extToLang: Record<string, string> = {
              js: "javascript",
              ts: "typescript",
              py: "python",
              java: "java",
              cpp: "cpp",
              c: "c",
              go: "go",
              rs: "rust",
              rb: "ruby",
            };
            fileLang = extToLang[ext] || defaultLanguage;
            fileName = name;
          } else {
            // No extension, add the default language extension
            const ext = extMap[defaultLanguage] || ".txt";
            fileName = name + ext;
          }
        }

        const newFile: FileNode = {
          id,
          name: fileName,
          type: type as "file" | "folder",
          parentId,
          children: [],
          code: type === "file" ? getDefaultCode(fileLang) : undefined,
          language: type === "file" ? fileLang : undefined,
          isOpen: false,
        };
        set({ files: [...files, newFile] });
      },

      updateFileCode: (id: string, code: string) =>
        set((s) => ({
          files: s.files.map((f) => (f.id === id ? { ...f, code } : f)),
        })),

      // Execution Actions using Judge0 API
      executeCode: async () => {
        const state = get();
        if (!state.activeFileId) return;

        // Always open console when running (ensure it's always visible)
        set({ isConsoleCollapsed: false });

        const activeFile = state.files.find((f) => f.id === state.activeFileId);
        if (!activeFile || activeFile.type !== "file") return;

        const lang = getLanguageByKey(activeFile.language || "javascript");
        if (!lang) {
          get().addOutput(state.activeFileId, `Error: Unsupported language`);
          get().setStatus(state.activeFileId, "error");
          return;
        }

        await codeExecutor.execute(
          activeFile.code || "",
          activeFile.language || "javascript",
          state.activeFileId,
        );
      },

      clearOutput: (id: string) =>
        set((s) => ({
          outputs: { ...s.outputs, [id]: [] },
          metas: { ...s.metas, [id]: { time: 0, memory: 0 } },
        })),

      addOutput: (id: string, output: string) =>
        set((s) => ({
          outputs: {
            ...s.outputs,
            [id]: [...(s.outputs[id] || []), output],
          },
        })),

      setStatus: (
        id: string,
        status: "idle" | "running" | "success" | "error",
      ) => set((s) => ({ statuses: { ...s.statuses, [id]: status } })),

      setMeta: (id: string, meta: ExecutionMeta) =>
        set((s) => ({ metas: { ...s.metas, [id]: meta } })),

      addRunHistory: (entry) =>
        set((s) => ({
          runHistory: [
            {
              ...entry,
              id: `${entry.fileId}-${Date.now()}`,
              createdAt: Date.now(),
            },
            ...s.runHistory,
          ].slice(0, 20),
        })),

      clearRunHistory: () => set({ runHistory: [] }),
    }),
    {
      name: "zunexis-storage",
      partialize: (state) => ({
        files: state.files,
        openFileIds: state.openFileIds,
        activeFileId: state.activeFileId,
        defaultLanguage: state.defaultLanguage,
        settings: {
          fontSize: state.settings.fontSize,
          fontFamily: state.settings.fontFamily,
          lineHeight: state.settings.lineHeight,
          editorTheme: state.settings.editorTheme,
          explicitEditorTheme: state.settings.explicitEditorTheme,
        },
      }),
    },
  ),
);
