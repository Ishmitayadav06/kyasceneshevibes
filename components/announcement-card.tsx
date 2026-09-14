"use client"

import { useState } from "react"
import { Bookmark, CalendarPlus, Check, CircleCheck, ExternalLink, Radio, Zap } from "lucide-react"
import { CountdownBadge } from "@/components/countdown-badge"
import { categoryStyles, type FeedItem } from "@/lib/campus-data"
import { useTasks } from "@/components/task-provider"

export function AnnouncementCard({ item, index = 0 }: { item: FeedItem; index?: number }) {
  const isCalendar = item.action.type === "calendar"
  const ActionIcon = isCalendar ? CalendarPlus : ExternalLink
  const [saved, setSaved] = useState(false)
  const { isDone, toggle, isTask } = useTasks()
  const done = isDone(item.id)

  return (
    <article
      className="cc-lift cc-fade-up rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-violet-500/30"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold " + categoryStyles[item.category]}>
            {item.category}
          </span>
          {item.priority === "Urgent" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-400">
              <Zap className="size-3" aria-hidden="true" />
              Urgent
            </span>
          )}
        </div>
        <CountdownBadge deadline={item.deadline} />
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">{item.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Radio className="size-3.5 shrink-0 text-violet-500" aria-hidden="true" />
          <span className="truncate">{item.source}</span>
        </span>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Save for later"}
            className={
              "inline-flex size-8 items-center justify-center rounded-full border transition-colors " +
              (saved
                ? "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            <Bookmark className={"size-3.5 " + (saved ? "fill-current" : "")} aria-hidden="true" />
          </button>

          {isCalendar ? (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("kya:navigate", { detail: "calendar" }))}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400"
            >
              <ActionIcon className="size-3.5" aria-hidden="true" />
              {item.action.label}
            </button>
          ) : (
            <a
              href={item.action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400"
            >
              <ActionIcon className="size-3.5" aria-hidden="true" />
              {item.action.label}
            </a>
          )}

          {isTask(item.id) && (
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={done}
              aria-label={done ? `Mark "${item.title}" as not completed` : `Mark "${item.title}" as completed`}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                (done
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:opacity-90")
              }
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : <CircleCheck className="size-3.5" aria-hidden="true" />}
              {done ? "Completed" : "Task completed"}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
