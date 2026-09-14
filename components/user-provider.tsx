"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { userProfile } from "@/lib/campus-data"

type UserContextValue = { name: string }

const UserContext = createContext<UserContextValue>({ name: userProfile.name })

export function useUser() {
  return useContext(UserContext)
}

/**
 * Holds the display name for the signed-in student. Falls back to the mock
 * profile name when no name was captured at login (e.g. "Continue as guest").
 */
export function UserProvider({ name, children }: { name?: string; children: ReactNode }) {
  const value = useMemo<UserContextValue>(() => ({ name: name?.trim() || userProfile.name }), [name])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
