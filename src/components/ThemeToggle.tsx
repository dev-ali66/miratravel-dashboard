import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95 shadow-sm ${className || ""}`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200" />
      )}
    </button>
  )
}
