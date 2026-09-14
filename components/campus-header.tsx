"use client"

import { Bell, GraduationCap, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { userProfile } from "@/lib/campus-data"

export function CampusHeader({
  title,
  subtitle,
  unread,
  onOpenSearch,
  onOpenNotifications,
}: {
  title: string
  subtitle: string
  unread: number
  onOpenSearch: () => void
  onOpenNotifications: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shadow-violet-600/40 lg:hidden">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">{title}</h1>
            <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-foreground sm:w-52 sm:justify-start"
            aria-label="Search campus"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden text-sm sm:inline">Search…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              /
            </kbd>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          >
            <Bell className="cc-bell size-4.5" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {unread}
              </span>
            )}
          </button>

          <ThemeToggle />

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 sm:flex">
            <img src="/student-avatar.png" alt="Your profile" className="size-7 rounded-full object-cover" />
            <span className="rounded-full bg-violet-600/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
              {userProfile.year} {userProfile.course.split(" ").map((w) => w[0]).join("")}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
