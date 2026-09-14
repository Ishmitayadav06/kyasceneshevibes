"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CornerDownLeft, Search, X } from "lucide-react"
import { categoryStyles, searchCampus, type Category, type NavView } from "@/lib/campus-data"

const quickPrompts = ["assignment", "workshop", "hostel", "coding club"]

export function SearchCommand({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: (view: NavView) => void
}) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchCampus(query), [query])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
      }
      if (e.key === "Enter" && results[active]) {
        e.preventDefault()
        onNavigate(results[active].view)
        onClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, results, active, onClose, onNavigate])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search campus">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="cc-scale-in relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements, events, societies…"
            aria-label="Search campus"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="px-2 py-3">
              <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Try searching</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQuery(p)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matches for “{query}”.</p>
          ) : (
            <ul className="space-y-1">
              {results.map((r, i) => {
                const style = categoryStyles[r.category as Category]
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        onNavigate(r.view)
                        onClose()
                      }}
                      className={
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors " +
                        (i === active ? "bg-accent" : "")
                      }
                    >
                      <span
                        className={
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                          (style ?? "bg-muted text-muted-foreground")
                        }
                      >
                        {r.category}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{r.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{r.subtitle}</span>
                      </span>
                      {i === active && <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  )
}
