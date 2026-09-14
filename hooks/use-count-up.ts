"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Animates a number from 0 to `target` once, after an optional delay.
 * Respects prefers-reduced-motion by jumping straight to the target.
 */
export function useCountUp(target: number, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduce) {
      setValue(target)
      return
    }

    let start: number | null = null
    let timeoutId: ReturnType<typeof setTimeout>

    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        frame.current = requestAnimationFrame(step)
      }
    }

    timeoutId = setTimeout(() => {
      frame.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, delay])

  return value
}
