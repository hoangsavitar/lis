import Image from "next/image";

type LisBrandProps = {
  className?: string;
  compact?: boolean;
  /** Logo tone: maroon on light surfaces (default) or black for high-contrast use */
  tone?: "maroon" | "black";
};

export function LisBrand({ className = "", compact = false, tone = "maroon" }: LisBrandProps) {
  return (
    <span className={`lis-brand inline-flex items-center gap-3 ${className}`}>
      <Image
        src={tone === "black" ? "/brand/lis-den.png" : "/brand/lis-do.png"}
        alt="LIS BY LII"
        width={215}
        height={100}
        className="h-6 w-auto select-none mix-blend-multiply sm:h-7"
      />
      {!compact && (
        <span className="hidden sm:inline-block border-l border-[var(--line)] pl-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Lời trao gửi
        </span>
      )}
    </span>
  );
}
