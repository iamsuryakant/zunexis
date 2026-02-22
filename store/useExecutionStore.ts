import { create } from "zustand"
import { nanoid } from "nanoid"

export type Status = "idle" | "running" | "success" | "error"

export type Language =
  | "javascript"
  | "python"
  | "cpp"
  | "java"

export interface Tab {
  id: string
  name: string
  language: Language
  code: string
  output: string[]
  status: Status
}

interface ExecutionState {
  tabs: Tab[]
  activeTabId: string

  setActiveTab: (id: string) => void
  addTab: () => void
  closeTab: (id: string) => void
  updateTab: (id: string, data: Partial<Tab>) => void
  clearOutput: (id: string) => void
  layout: "bottom" | "left" | "right"
setLayout: (layout: "bottom" | "left" | "right") => void
}

export const useExecutionStore = create<ExecutionState>((set, get) => {
  const initialId = nanoid()

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

    setActiveTab: (id) => set({ activeTabId: id }),
    layout: "bottom",
    setLayout: (layout) => set({ layout }),

    addTab: () => {
      const newId = nanoid()
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
      }))
    },

    closeTab: (id) => {
      set((state) => {
        const filtered = state.tabs.filter((t) => t.id !== id)
        return {
          tabs: filtered,
          activeTabId:
            state.activeTabId === id && filtered.length
              ? filtered[0].id
              : state.activeTabId,
        }
      })
    },

    updateTab: (id, data) => {
      set((state) => ({
        tabs: state.tabs.map((t) =>
          t.id === id ? { ...t, ...data } : t
        ),
      }))
    },

    clearOutput: (id) => {
      set((state) => ({
        tabs: state.tabs.map((t) =>
          t.id === id ? { ...t, output: [] } : t
        ),
      }))
    },
  }
})