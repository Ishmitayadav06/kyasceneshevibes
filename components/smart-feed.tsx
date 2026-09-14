"use client"

import { useMemo, useState } from "react"
import { Inbox } from "lucide-react"
import { AnnouncementCard } from "@/components/announcement-card"
import { feedItems, filterFeed, filters, sortByDeadline, type Filter } from "@/lib/campus-data"

export function SmartFeed({ limit }: { limit?: number }) {
  const [active, setActive] = useState<Filter>("All")

  const visible = useMemo(() => {
    const list = sortByDeadline(filterFeed(feedItems, active))
    return limit ? list.slice(0, limit) : list
  }, [active, limit])

  return (
    <section aria-label="Smart feed" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight">Smart Feed</h2>
        <span className="text-xs font-medium text-muted-foreground">
          {visible.length} update{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Filter announcements"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((f) => {
          const selected = f === active
          return (
            <button
              key={f}
              role="tab"
              aria-selected={selected}
              type="button"
              onClick={() => setActive(f)}
              className={
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors " +
                (selected
                  ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground")
              }
            >
              {f}
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((item, i) => (
            <AnnouncementCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 py-10 text-center">
          <Inbox className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground">No updates in this category</p>
        </div>
      )}
    </section>
  )
}
