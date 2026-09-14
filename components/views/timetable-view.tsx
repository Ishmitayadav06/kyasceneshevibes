"use client"

import { useMemo, useState } from "react"
import { CalendarClock, Clock, MapPin, RotateCcw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  classTypeStyles,
  getTimetable,
  timetableBranches,
  timetablePrograms,
  timetableSections,
  type TimetableBatch,
  type TimetableBranch,
  type TimetableSection,
} from "@/lib/campus-data"

export function TimetableView() {
  const [batch, setBatch] = useState<TimetableBatch | null>(null)
  const [branch, setBranch] = useState<TimetableBranch | null>(null)
  const [section, setSection] = useState<TimetableSection | null>(null)
  const [confirmed, setConfirmed] = useState<{
    batch: TimetableBatch
    branch: TimetableBranch
    section: TimetableSection
  } | null>(null)

  const timetable = useMemo(
    () => (confirmed ? getTimetable(confirmed.batch, confirmed.branch, confirmed.section) : []),
    [confirmed],
  )

  if (!confirmed) {
    return (
      <section aria-label="Select your class" className="mx-auto max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <CalendarClock className="size-5.5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-bold tracking-tight">Find your timetable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your batch, branch and section to load your weekly class schedule.
          </p>

          <fieldset className="mt-6 space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Batch</legend>
            {timetablePrograms.map((group) => (
              <div key={group.program} className="space-y-2">
                <p className="text-[11px] font-medium text-muted-foreground/80">{group.program}</p>
                <div className="flex flex-wrap gap-2">
                  {group.batches.map((b) => {
                    const active = batch === b
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBatch(b as TimetableBatch)}
                        aria-pressed={active}
                        className={
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                          (active
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/25"
                            : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground")
                        }
                      >
                        {b}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset className="mt-5 space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Branch</legend>
            <div className="flex flex-wrap gap-2">
              {timetableBranches.map((b) => {
                const active = branch === b
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    aria-pressed={active}
                    className={
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                      (active
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/25"
                        : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground")
                    }
                  >
                    {b}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5 space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Section</legend>
            <div className="flex flex-wrap gap-2">
              {timetableSections.map((s) => {
                const active = section === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSection(s)}
                    aria-pressed={active}
                    className={
                      "size-11 rounded-xl text-sm font-semibold transition-colors " +
                      (active
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/25"
                        : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground")
                    }
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <Button
            className="mt-7 w-full"
            disabled={!batch || !branch || !section}
            onClick={() => batch && branch && section && setConfirmed({ batch, branch, section })}
          >
            View timetable
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Showing timetable for</p>
          <p className="text-sm font-bold tracking-tight">
            Batch {confirmed.batch} · {confirmed.branch} · Section {confirmed.section}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setConfirmed(null)
          }}
        >
          <RotateCcw className="mr-1.5 size-4" aria-hidden="true" />
          Change selection
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {timetable.map((day) => (
          <section
            key={day.day}
            aria-label={day.day}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <h3 className="mb-3 text-sm font-bold tracking-tight">{day.day}</h3>
            <ul className="space-y-2.5">
              {day.slots.map((slot, i) => (
                <li key={`${day.day}-${i}`} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug text-foreground">{slot.subject}</p>
                    <span
                      className={"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold " + classTypeStyles[slot.type]}
                    >
                      {slot.type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{slot.code}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {slot.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {slot.room}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3.5" aria-hidden="true" />
                      {slot.faculty}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
