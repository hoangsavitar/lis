import Image from "next/image";

type LisBrandProps = {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function LisBrand({ className = "", compact = false, inverse = false }: LisBrandProps) {
  return (
    <span className={`lis-brand ${inverse ? "is-inverse" : ""} ${className}`}>
      <span className="lis-brand-mark" aria-hidden="true">
        <Image
          src="/brand/lis-by-lii-mark.png"
          alt=""
          fill
          sizes="48px"
          className="lis-brand-mark-image"
        />
      </span>
      <span className="lis-brand-copy">
        <strong>LIS BY LII</strong>
        {!compact && <em>Empower Your Elegance</em>}
      </span>
    </span>
  );
}
