type LisBrandProps = {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function LisBrand({ className = "", compact = false, inverse = false }: LisBrandProps) {
  return (
    <span className={`lis-brand inline-flex items-center gap-3 ${inverse ? "text-white" : "text-[var(--ink)]"} ${className}`}>
      <span className="font-display text-xl sm:text-2xl font-medium tracking-[0.32em] text-[var(--ink)] uppercase select-none">
        L I S
      </span>
      {!compact && (
        <span className="hidden sm:inline-block border-l border-[var(--line)] pl-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Dearly, from LIS
        </span>
      )}
    </span>
  );
}

