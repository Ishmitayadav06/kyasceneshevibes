"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { taskItems } from "@/lib/campus-data"
import { CompletionCelebration } from "@/components/completion-celebration"

const TASK_IDS = taskItems.map((i) => i.id)

type TaskContextValue = {
  isDone: (id: string) => boolean
  toggle: (id: string) => void
  /** Whether this feed item counts as a deadline task. */
  isTask: (id: string) => boolean
  /** Number of remaining (not-yet-done) tasks among the given ids. */
  remainingAmong: (ids: string[]) => number
  completed: number
  total: number
  allDone: boolean
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider")
  return ctx
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [doneIds, setDoneIds] = useState<Set<string>>(() => new Set())
  const [celebrate, setCelebrate] = useState(false)
  const prevAllDone = useRef(false)

  const toggle = useCallback((id: string) => {
    setDoneIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const completed = useMemo(() => TASK_IDS.filter((id) => doneIds.has(id)).length, [doneIds])
  const total = TASK_IDS.length
  const allDone = total > 0 && completed === total

  useEffect(() => {
    if (allDone && !prevAllDone.current) setCelebrate(true)
    prevAllDone.current = allDone
  }, [allDone])

  const value = useMemo<TaskContextValue>(
    () => ({
      isDone: (id) => doneIds.has(id),
      toggle,
      isTask: (id) => TASK_IDS.includes(id),
      remainingAmong: (ids) => ids.filter((id) => !doneIds.has(id)).length,
      completed,
      total,
      allDone,
    }),
    [doneIds, toggle, completed, total, allDone],
  )

  return (
    <TaskContext.Provider value={value}>
      {children}
      <CompletionCelebration open={celebrate} total={total} onClose={() => setCelebrate(false)} />
    </TaskContext.Provider>
  )
}
