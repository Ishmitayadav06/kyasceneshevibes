"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Coffee, Moon, Palette, Sun } from "lucide-react"

type Theme = "light" | "dark" | "cream"

const OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "cream", label: "Cream", icon: Coffee },
]

const ICONS: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, cream: Coffee }

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light"
  const root = document.documentElement
  if (root.classList.contains("dark")) return "dark"
  if (root.classList.contains("cream")) return "cream"
  return "light"
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setTheme(currentTheme())
  }, [])

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function choose(next: Theme) {
    setTheme(next)
    setOpen(false)
    const root = document.documentElement
    root.classList.remove("light", "dark", "cream")
    root.classList.add(next)
    try {
      localStorage.setItem("cc-theme", next)
    } catch {}
  }

  const ActiveIcon = mounted ? ICONS[theme] : Palette

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
      >
        <ActiveIcon className="size-4.5" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="cc-scale-in absolute right-0 top-11 z-50 w-40 origin-top-right rounded-2xl border border-border bg-popover p-1.5 shadow-xl shadow-black/10"
        >
          <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Theme</p>
          {OPTIONS.map(({ id, label, icon: Icon }) => {
            const active = theme === id
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(id)}
                className={
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors " +
                  (active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-accent hover:text-foreground")
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-left">{label}</span>
                {active && <Check className="size-4 shrink-0" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
