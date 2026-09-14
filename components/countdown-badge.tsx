"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle2, AlarmClock } from "lucide-react"

function format(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { text: "Past due", urgent: true, done: true }
  const totalMinutes = Math.floor(diff / 60000)
  const dd = Math.floor(totalMinutes / (60 * 24))
  const hh = Math.floor((totalMinutes % (60 * 24)) / 60)
  const mm = totalMinutes % 60
  let text: string
  if (dd > 0) text = `${dd}d ${hh}h left`
  else if (hh > 0) text = `${hh}h ${mm}m left`
  else text = `${mm}m left`
  return { text, urgent: dd === 0 && hh < 12, done: false }
}

export function CountdownBadge({ deadline }: { deadline: string | null }) {
  const [state, setState] = useState<ReturnType<typeof format> | null>(null)

  useEffect(() => {
    if (!deadline) return
    setState(format(deadline))
    const id = setInterval(() => setState(format(deadline)), 30000)
    return () => clearInterval(id)
  }, [deadline])

  if (!deadline) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" aria-hidden="true" />
        No deadline
      </span>
    )
  }

  if (!state) return null

  if (state.done) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        {state.text}
      </span>
    )
  }

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold " +
        (state.urgent
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : "bg-violet-500/10 text-violet-600 dark:text-violet-400")
      }
    >
      <AlarmClock className="size-3.5" aria-hidden="true" />
      {state.text}
    </span>
  )
}
