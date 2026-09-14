"use client"

import { useEffect } from "react"
import { AlertTriangle, BookOpen, CalendarDays, CheckCheck, Users, X } from "lucide-react"
import type { CampusNotification, NotificationCategory } from "@/lib/campus-data"

const categoryIcon: Record<NotificationCategory, typeof AlertTriangle> = {
  Urgent: AlertTriangle,
  Academic: BookOpen,
  Societies: Users,
  Events: CalendarDays,
}

const categoryTone: Record<NotificationCategory, string> = {
  Urgent: "bg-rose-500/15 text-rose-500",
  Academic: "bg-violet-500/15 text-violet-500",
  Societies: "bg-amber-500/15 text-amber-500",
  Events: "bg-sky-500/15 text-sky-500",
}

export function NotificationPanel({
  open,
  items,
  onClose,
  onMarkAllRead,
}: {
  open: boolean
  items: CampusNotification[]
  onClose: () => void
  onMarkAllRead: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Notifications">
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />
      <div className="cc-scale-in absolute right-2 top-2 flex max-h-[85vh] w-[calc(100%-1rem)] max-w-sm flex-col rounded-2xl border border-border bg-popover shadow-2xl sm:right-4 sm:top-16 sm:w-96">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">Notifications</h2>
            <span className="rounded-full bg-violet-600/10 px-2 py-0.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
              {items.filter((n) => !n.read).length} new
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {items.map((n) => {
            const Icon = categoryIcon[n.category]
            return (
              <li
                key={n.id}
                className={"flex gap-3 px-4 py-3 transition-colors " + (n.read ? "opacity-60" : "bg-violet-500/[0.03]")}
              >
                <span className={"mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full " + categoryTone[n.category]}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-violet-600" aria-label="Unread" />}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.detail}</p>
                  <p className="mt-1 text-[11px] font-medium text-muted-foreground/70">{n.time}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  )
}
