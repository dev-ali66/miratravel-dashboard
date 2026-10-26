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
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/70 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${className || ""}`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-8 w-8 text-amber-400 transition-transform duration-200" />
      ) : (
        <Moon className="h-8 w-8 text-slate-700 dark:text-slate-200 transition-transform duration-200" />
      )}
    </button>
  )
}
