"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { CalendarEvent } from "@/lib/campus-data"

type CalendarContextValue = {
  /** Events the user has explicitly added to their in-app calendar. */
  userEvents: CalendarEvent[]
  addEvent: (event: CalendarEvent) => void
  removeEvent: (id: string) => void
  hasEvent: (id: string) => boolean
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([])

  const addEvent = useCallback((event: CalendarEvent) => {
    setUserEvents((prev) => (prev.some((e) => e.id === event.id) ? prev : [...prev, event]))
  }, [])

  const removeEvent = useCallback((id: string) => {
    setUserEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const hasEvent = useCallback((id: string) => userEvents.some((e) => e.id === id), [userEvents])

  const value = useMemo(
    () => ({ userEvents, addEvent, removeEvent, hasEvent }),
    [userEvents, addEvent, removeEvent, hasEvent],
  )

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error("useCalendar must be used within a CalendarProvider")
  return ctx
}
