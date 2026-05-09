"use client"

import { useExecutionStore } from "@/stores/useExecutionStore"
import { Code2, Palette as PaletteIcon, Type, Sliders } from "lucide-react"
import { useTheme } from "next-themes"
import { LANGUAGES } from "@/lib/languages"

const THEMES = [
  "github-dark",
  "github-light",
  "monokai",
  "dracula",
  "tomorrow-night",
  "solarized-dark",
  "solarized-light",
  "twilight",
  "xcode",
  "textmate",
  "terminal",
  "eclipse",
]

const DARK_THEMES = ["github-dark", "monokai", "dracula", "tomorrow-night", "solarized-dark", "twilight", "terminal"]

export default function SettingsPanel() {
  const { settings, updateSettings, defaultLanguage, setDefaultLanguage } = useExecutionStore()
  const { setTheme } = useTheme()

  const fontSizes = [12, 13, 14, 15, 16, 18]

  const handleThemeChange = (themeId: string) => {
    updateSettings({ editorTheme: themeId })
    // Sync website theme with editor theme
    if (DARK_THEMES.includes(themeId)) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <div className="flex flex-col h-full bg-transparent p-4 space-y-6 overflow-y-auto no-scrollbar">
      {/* Default Language Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <Code2 size={14} strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Default Language</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setDefaultLanguage(lang.key)}
              className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                defaultLanguage === lang.key
                ? "bg-primary/10 border-primary/30 text-primary font-medium"
                : "border-border/30 hover:border-border/60 text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      {/* Font Size Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <Type size={14} strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Font Size</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {fontSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={`h-9 rounded-lg text-xs transition-all border flex items-center justify-center ${
                settings.fontSize === size
                ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                : "border-border/30 hover:border-border/60 text-muted-foreground/80 hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      {/* Line Height */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Sliders size={14} strokeWidth={2} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Line Height</span>
          </div>
          <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
            {settings.lineHeight}
          </span>
        </div>
        <input
          type="range"
          min="1.2"
          max="2.0"
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
          className="w-full accent-primary bg-muted/50 rounded-full h-1.5 appearance-none cursor-pointer"
        />
      </section>

      {/* Editor Theme Section */}
      <section className="pt-4 border-t border-border/20">
        <div className="flex items-center gap-2 text-muted-foreground/60 mb-3">
          <PaletteIcon size={14} strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Editor Theme</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {THEMES.map((themeId) => (
            <button
              key={themeId}
              onClick={() => handleThemeChange(themeId)}
              className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                settings.editorTheme === themeId
                ? "bg-primary/10 border-primary/30 text-primary font-medium"
                : "border-border/30 hover:border-border/60 text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
              }`}
            >
              {themeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}