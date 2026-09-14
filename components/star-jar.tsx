"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Star } from "lucide-react"
import { useTasks } from "@/components/task-provider"

const BURST_COLORS = ["#fbbf24", "#f59e0b", "#facc15", "#8b5cf6", "#6366f1", "#ec4899", "#38bdf8"]

// Stable star positions inside the jar (percent from left / top of the body).
// They light up bottom-first as the "star liquid" rises past them.
const JAR_STARS = [
  { left: 32, top: 84 },
  { left: 64, top: 78 },
  { left: 22, top: 66 },
  { left: 74, top: 60 },
  { left: 46, top: 50 },
  { left: 30, top: 38 },
  { left: 62, top: 30 },
  { left: 48, top: 20 },
]

export function StarJar() {
  const { completed, total, allDone } = useTasks()
  const pct = total > 0 ? completed / total : 0
  const fillPct = Math.round(pct * 100)

  const [burst, setBurst] = useState(false)
  const prevAllDone = useRef(false)

  // Fire the screen-wide star burst once, on the transition into "all done".
  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      setBurst(true)
      const t = window.setTimeout(() => setBurst(false), 2600)
      prevAllDone.current = true
      return () => window.clearTimeout(t)
    }
    if (!allDone) prevAllDone.current = false
  }, [allDone])

  const burstStars = useMemo(() => {
    if (!burst) return []
    return Array.from({ length: 40 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 28 + Math.random() * 60
      return {
        id: i,
        sx: `${Math.cos(angle) * dist}vw`,
        sy: `${Math.sin(angle) * dist}vh`,
        dur: `${1.6 + Math.random() * 1}s`,
        delay: `${Math.random() * 0.35}s`,
        size: 12 + Math.round(Math.random() * 22),
        color: BURST_COLORS[i % BURST_COLORS.length],
        rot: `${(Math.random() - 0.5) * 900}deg`,
        scale: (0.6 + Math.random() * 0.9).toFixed(2),
      }
    })
  }, [burst])

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">Star Jar</p>
          <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
            {completed}/{total}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-center">
          <div className={"relative " + (burst ? "cc-jar-pop" : "")}>
            {/* lid + neck */}
            <div className="mx-auto h-2 w-12 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 shadow-sm" />
            <div className="mx-auto -mt-px h-1.5 w-8 rounded-b-md bg-violet-500/70" />

            {/* glass body */}
            <div className="relative mt-0.5 h-20 w-16 overflow-hidden rounded-b-[1.4rem] rounded-t-sm border-2 border-white/40 bg-white/10 shadow-inner backdrop-blur-sm">
              {/* rising star liquid */}
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 transition-[height] duration-700 ease-out"
                style={{ height: `${fillPct}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-white/50" />
              </div>

              {/* stars — brighten once the liquid rises past them */}
              {JAR_STARS.map((s, i) => {
                const lit = 100 - s.top <= fillPct
                return (
                  <Star
                    key={i}
                    className={
                      "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 " +
                      (lit ? "cc-star-twinkle text-white drop-shadow" : "text-white/25")
                    }
                    style={{
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                      width: 11,
                      height: 11,
                      animationDelay: `${i * 0.12}s`,
                    }}
                    fill={lit ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                )
              })}

              {/* glass sheen */}
              <div className="pointer-events-none absolute left-1 top-1 h-full w-2 rounded-full bg-white/25 blur-[1px]" />
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
          {allDone ? (
            <span className="font-semibold text-amber-500">Jar full — you did it!</span>
          ) : (
            <>Complete tasks to fill your jar with stars.</>
          )}
        </p>
      </div>

      {/* Screen-wide star burst when the jar fills up */}
      {burst && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
          <div className="absolute left-1/2 top-1/2">
            {burstStars.map((b) => (
              <Star
                key={b.id}
                className="cc-star-spread absolute"
                style={
                  {
                    width: b.size,
                    height: b.size,
                    color: b.color,
                    "--sx": b.sx,
                    "--sy": b.sy,
                    "--sr": b.rot,
                    "--ss": b.scale,
                    "--cc-dur": b.dur,
                    "--cc-delay": b.delay,
                  } as React.CSSProperties
                }
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
