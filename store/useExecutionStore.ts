import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { LANGUAGES } from "@/lib/languages";
import { runJSWorker } from "@/lib/jsRuntime";

export type Status = "idle" | "running" | "success" | "error";

export type Language =
  | "javascript"
  | "python"
  | "cpp"
  | "java"
  | "c"
  | "bash";

export interface ExecutionMeta {
  time?: string;
  memory?: number;
}

export interface Tab {
  id: string;
  name: string;
  language: Language;
  code: string;
  output: string[];
  status: Status;
  meta?: ExecutionMeta;
  languageMemory: Partial<Record<Language, string>>;
}

interface ExecutionState {
  tabs: Tab[];
  activeTabId: string;
  layout: "bottom" | "left" | "right";

  preferredLanguage: Language;
  isConsoleCollapsed: boolean;

  setPreferredLanguage: (language: Language) => void;
  toggleConsole: () => void;

  setActiveTab: (id: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, data: Partial<Tab>) => void;
  switchLanguage: (id: string, language: Language) => void;
  clearOutput: (id: string) => void;
  setLayout: (layout: "bottom" | "left" | "right") => void;
  executeCode: () => Promise<void>;
}

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set, get) => {
      const defaultLang: Language = "javascript";

      const getBoilerplate = (lang: Language) =>
        LANGUAGES.find((l) => l.key === lang)?.boilerplate ?? "";

      const createTab = (name: string, language: Language): Tab => ({
        id: nanoid(),
        name,
        language,
        code: getBoilerplate(language),
        output: [],
        status: "idle",
        meta: undefined,
        languageMemory: {
          [language]: getBoilerplate(language),
        },
      });

      const initialTab = createTab("Tab 1", defaultLang);

      return {
        tabs: [initialTab],
        activeTabId: initialTab.id,
        layout: "right",

        preferredLanguage: defaultLang,
        isConsoleCollapsed: false,

        setPreferredLanguage: (language) =>
          set({ preferredLanguage: language }),

        toggleConsole: () =>
          set((state) => ({
            isConsoleCollapsed: !state.isConsoleCollapsed,
          })),

        setActiveTab: (id) => set({ activeTabId: id }),

        setLayout: (layout) => set({ layout }),

        addTab: () => {
          const { preferredLanguage, tabs } = get();

          const newTab = createTab(
            `Tab ${tabs.length + 1}`,
            preferredLanguage
          );

          const updatedTabs = [...tabs, newTab].map((t, i) => ({
            ...t,
            name: `Tab ${i + 1}`,
          }));

          set({
            tabs: updatedTabs,
            activeTabId: newTab.id,
          });
        },

        closeTab: (id) =>
          set((state) => {
            const filtered = state.tabs.filter(
              (t) => t.id !== id
            );

            if (filtered.length === 0) {
              const newTab = createTab(
                "Tab 1",
                state.preferredLanguage
              );

              return {
                tabs: [newTab],
                activeTabId: newTab.id,
              };
            }

            const renamed = filtered.map((t, i) => ({
              ...t,
              name: `Tab ${i + 1}`,
            }));

            return {
              tabs: renamed,
              activeTabId:
                state.activeTabId === id
                  ? renamed[0].id
                  : state.activeTabId,
            };
          }),

        updateTab: (id, data) =>
          set((state) => ({
            tabs: state.tabs.map((t) =>
              t.id === id ? { ...t, ...data } : t
            ),
          })),

        switchLanguage: (id, language) =>
          set((state) => ({
            preferredLanguage: language,
            tabs: state.tabs.map((tab) => {
              if (tab.id !== id) return tab;

              const updatedMemory = {
                ...tab.languageMemory,
                [tab.language]: tab.code,
              };

              const restoredCode =
                updatedMemory[language] ??
                getBoilerplate(language);

              return {
                ...tab,
                language,
                code: restoredCode,
                languageMemory: updatedMemory,
                output: [],
                status: "idle",
                meta: undefined,
              };
            }),
          })),

        clearOutput: (id) =>
          set((state) => ({
            tabs: state.tabs.map((t) =>
              t.id === id
                ? { ...t, output: [], meta: undefined }
                : t
            ),
          })),

        executeCode: async () => {
          const { tabs, activeTabId } = get();
          const activeTab = tabs.find(
            (t) => t.id === activeTabId
          );
          if (!activeTab) return;

          set((state) => ({
            tabs: state.tabs.map((t) =>
              t.id === activeTabId
                ? {
                    ...t,
                    status: "running",
                    output: [],
                    meta: undefined,
                  }
                : t
            ),
          }));

          if (activeTab.language === "javascript") {
            runJSWorker(
              activeTab.code,
              activeTabId,
              set
            );
            return;
          }

          const langConfig = LANGUAGES.find(
            (l) => l.key === activeTab.language
          );
          if (!langConfig) return;

          try {
            const res = await fetch("/api/execute", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                source_code: activeTab.code,
                language_id: langConfig.id,
              }),
            });

            const data = await res.json();

            const output =
              data.stdout ||
              data.stderr ||
              data.compile_output ||
              "No Output";

            const isError =
              data.stderr || data.compile_output;

            set((state) => ({
              tabs: state.tabs.map((t) =>
                t.id === activeTabId
                  ? {
                      ...t,
                      output: output.split("\n"),
                      status: isError
                        ? "error"
                        : "success",
                      meta: {
                        time: data.time,
                        memory: data.memory,
                      },
                    }
                  : t
              ),
            }));
          } catch {
            set((state) => ({
              tabs: state.tabs.map((t) =>
                t.id === activeTabId
                  ? {
                      ...t,
                      output: ["Execution failed."],
                      status: "error",
                    }
                  : t
              ),
            }));
          }
        },
      };
    },
    {
      name: "zunexis-storage",
      partialize: (state) => ({
        tabs: state.tabs.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ output, status, meta, ...rest }) => ({
            ...rest,
            output: [],
            status: "idle",
            meta: undefined,
          })
        ),
        activeTabId: state.activeTabId,
        layout: state.layout,
        preferredLanguage: state.preferredLanguage,
        isConsoleCollapsed: state.isConsoleCollapsed,
      }),
    }
  )
);