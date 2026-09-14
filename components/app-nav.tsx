"use client"

import {
  CalendarClock,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  MessageCircleHeart,
  Newspaper,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react"
import type { NavView } from "@/lib/campus-data"
import { StarJar } from "@/components/star-jar"

export const NAV_ITEMS: { id: NavView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "feed", label: "Smart Feed", icon: Newspaper },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "timetable", label: "Timetable", icon: CalendarClock },
  { id: "events", label: "Events", icon: Ticket },
  { id: "societies", label: "Societies", icon: Users },
  { id: "summarizer", label: "AI Summarizer", icon: Sparkles },
  { id: "bestie", label: "Bestie", icon: MessageCircleHeart },
]

export const VIEW_TITLES: Record<NavView, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Your campus at a glance" },
  feed: { title: "Smart Feed", subtitle: "Prioritized updates from every channel" },
  calendar: { title: "Calendar", subtitle: "Deadlines and events on your timeline" },
  timetable: { title: "Timetable", subtitle: "Your weekly class schedule by batch and section" },
  events: { title: "Campus Events", subtitle: "Workshops, fests, and competitions" },
  societies: { title: "Societies", subtitle: "Communities to join and follow" },
  summarizer: { title: "AI Summarizer", subtitle: "Turn any announcement into clarity" },
  bestie: { title: "Bestie", subtitle: "Your always-online campus BFF" },
}

/** Desktop sidebar. */
export function Sidebar({ view, onNavigate }: { view: NavView; onNavigate: (v: NavView) => void }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border/70 bg-card/40 px-3 py-4 lg:flex">
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shadow-violet-600/40">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="font-[family-name:var(--font-script)] text-2xl font-bold leading-none tracking-tight text-foreground">
            Kya Scene?
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Know what&apos;s happening, without the scroll</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const activeItem = view === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={activeItem ? "page" : undefined}
              className={
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (activeItem
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground")
              }
            >
              <Icon className="size-4.5 shrink-0" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="mt-2 shrink-0">
        <StarJar />
      </div>
    </aside>
  )
}

/** Mobile bottom navigation bar. */
export function MobileNav({ view, onNavigate }: { view: NavView; onNavigate: (v: NavView) => void }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border/70 bg-background/90 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const activeItem = view === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={activeItem ? "page" : undefined}
            className={
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors " +
              (activeItem ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground")
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="max-w-full truncate">{label.replace("AI ", "")}</span>
          </button>
        )
      })}
    </nav>
  )
}
