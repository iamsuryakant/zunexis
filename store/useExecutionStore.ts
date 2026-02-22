import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type Status = "idle" | "running" | "success" | "error";
export type Language = "javascript" | "python" | "cpp" | "java";

export interface Tab {
  id: string;
  name: string;
  language: Language;
  code: string;
  output: string[];
  status: Status;
}

interface ExecutionState {
  tabs: Tab[];
  activeTabId: string;
  layout: "bottom" | "left" | "right";

  setActiveTab: (id: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, data: Partial<Tab>) => void;
  clearOutput: (id: string) => void;
  setLayout: (layout: "bottom" | "left" | "right") => void;
}

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set, get) => {
      const initialId = nanoid();

      return {
        tabs: [
          {
            id: initialId,
            name: "Tab 1",
            language: "javascript",
            code: 'console.log("Welcome to Zunexis IDE!")',
            output: [],
            status: "idle",
          },
        ],
        activeTabId: initialId,
        layout: "right",

        setActiveTab: (id) => set({ activeTabId: id }),

        setLayout: (layout) => set({ layout }),

        addTab: () => {
          const newId = nanoid();
          set((state) => ({
            tabs: [
              ...state.tabs,
              {
                id: newId,
                name: `Tab ${state.tabs.length + 1}`,
                language: "javascript",
                code: "",
                output: [],
                status: "idle",
              },
            ],
            activeTabId: newId,
          }));
        },

        closeTab: (id) =>
          set((state) => {
            const tabIndex = state.tabs.findIndex((t) => t.id === id);
            const isActive = state.activeTabId === id;

            const newTabs = state.tabs.filter((t) => t.id !== id);

            let newActiveId = state.activeTabId;

            if (isActive) {
              if (tabIndex > 0) {
                newActiveId = newTabs[tabIndex - 1]?.id;
              } else {
                newActiveId = newTabs[0]?.id;
              }
            }

            return {
              tabs: newTabs.length ? newTabs : [],
              activeTabId: newActiveId,
            };
          }),

        updateTab: (id, data) =>
          set((state) => ({
            tabs: state.tabs.map((t) =>
              t.id === id ? { ...t, ...data } : t
            ),
          })),

        clearOutput: (id) =>
          set((state) => ({
            tabs: state.tabs.map((t) =>
              t.id === id ? { ...t, output: [] } : t
            ),
          })),
      };
    },
    {
      name: "zunexis-storage",
      partialize: (state) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tabs: state.tabs.map(({ output, status, ...rest }) => ({
          ...rest,
          output: [],      
          status: "idle",
        })),
        activeTabId: state.activeTabId,
        layout: state.layout,
      }),
    }
  )
);