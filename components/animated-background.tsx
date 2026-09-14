/** Theme-aware animated aurora backdrop. Colors come from the --aurora-* tokens. */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="cc-drift absolute -left-[15%] -top-[20%] size-[55vmax] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle at center, var(--aurora-1), transparent 70%)" }}
      />
      <div
        className="cc-drift absolute -right-[12%] top-[5%] size-[50vmax] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle at center, var(--aurora-2), transparent 70%)", animationDelay: "-9s" }}
      />
      <div
        className="cc-drift absolute bottom-[-20%] left-[25%] size-[48vmax] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle at center, var(--aurora-3), transparent 70%)", animationDelay: "-17s" }}
      />
      {/* A slowly panning fine grid gives quiet, continuous motion + depth. */}
      <div
        className="cc-grid-pan absolute inset-[-48px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: "var(--cc-grid-opacity, 0.05)",
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      />

      {/* A soft diagonal sheen drifts across everything for a living feel. */}
      <div
        className="cc-wave absolute inset-0"
        style={{
          opacity: "var(--cc-sheen-opacity, 0.6)",
          backgroundImage:
            "linear-gradient(115deg, transparent 35%, var(--cc-sheen-color, var(--aurora-2)) 50%, transparent 65%)",
        }}
      />
    </div>
  )
}
