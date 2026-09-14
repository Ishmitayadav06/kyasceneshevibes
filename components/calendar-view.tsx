"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  feedCalendarEvents,
  eventCategories,
  eventDotColors,
  type CalendarEvent,
  type EventCategory,
} from "@/lib/campus-data"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toDateInputValue(d: Date) {
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export function CalendarView() {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState(() => new Date())
  const [selected, setSelected] = useState<Date>(() => new Date())
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([])
  const [adding, setAdding] = useState(false)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftDate, setDraftDate] = useState(() => toDateInputValue(new Date()))
  const [draftCategory, setDraftCategory] = useState<EventCategory>("Personal")

  const events = useMemo<CalendarEvent[]>(
    () => [...feedCalendarEvents(), ...userEvents],
    [userEvents],
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = useMemo(() => {
    const list: (Date | null)[] = []
    for (let i = 0; i < startOffset; i++) list.push(null)
    for (let d = 1; d <= daysInMonth; d++) list.push(new Date(year, month, d))
    while (list.length % 7 !== 0) list.push(null)
    return list
  }, [year, month, startOffset, daysInMonth])

  const eventsFor = (date: Date) =>
    events
      .filter((e) => sameDay(new Date(e.date), date))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))

  const selectedEvents = eventsFor(selected)

  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  const shiftMonth = (delta: number) =>
    setViewDate(new Date(year, month + delta, 1))

  function addEvent() {
    if (!draftTitle.trim()) return
    const iso = new Date(`${draftDate}T09:00:00`).toISOString()
    setUserEvents((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        title: draftTitle.trim(),
        date: iso,
        category: draftCategory,
      },
    ])
    setSelected(new Date(`${draftDate}T09:00:00`))
    setViewDate(new Date(`${draftDate}T09:00:00`))
    setDraftTitle("")
    setDraftCategory("Personal")
    setAdding(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      {/* Calendar grid */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">
            {monthLabel}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setViewDate(new Date())
                setSelected(new Date())
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="pb-2 text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="aspect-square" />
            const dayEvents = eventsFor(date)
            const isSelected = sameDay(date, selected)
            const isToday = sameDay(date, today)
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelected(date)}
                className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-lg p-1 text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
                aria-pressed={isSelected}
                aria-label={`${date.toDateString()}${
                  dayEvents.length ? `, ${dayEvents.length} events` : ""
                }`}
              >
                <span
                  className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isToday && !isSelected
                      ? "bg-primary/15 font-semibold text-primary"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </span>
                <span className="flex flex-wrap items-center justify-center gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-primary-foreground" : eventDotColors[e.category]
                      }`}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail + add */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {selected.toLocaleDateString(undefined, { weekday: "long" })}
            </p>
            <h3 className="text-lg font-semibold text-card-foreground">
              {selected.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </h3>
          </div>
          <Button size="sm" onClick={() => setAdding((v) => !v)}>
            {adding ? (
              <>
                <X className="mr-1 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" /> Add event
              </>
            )}
          </Button>
        </div>

        {adding && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-muted/40 p-3">
            <div className="space-y-1.5">
              <label
                htmlFor="event-title"
                className="text-xs font-medium text-muted-foreground"
              >
                Title
              </label>
              <input
                id="event-title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.nativeEvent.isComposing &&
                    e.keyCode !== 229
                  ) {
                    e.preventDefault()
                    addEvent()
                  }
                }}
                placeholder="e.g. Study group for OS"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="event-date"
                className="text-xs font-medium text-muted-foreground"
              >
                Date
              </label>
              <input
                id="event-date"
                type="date"
                value={draftDate}
                onChange={(e) => setDraftDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {eventCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDraftCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      draftCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${eventDotColors[cat]}`}
                    />
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" size="sm" onClick={addEvent}>
              Save event
            </Button>
          </div>
        )}

        {selectedEvents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nothing scheduled for this day.
          </p>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${eventDotColors[e.category]}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {e.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {e.category}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
