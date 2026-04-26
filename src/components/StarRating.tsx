type StarRatingProps = {
  rating: number;
  label?: string;
  size?: "sm" | "md";
};

const ratingColor = (rating: number) => {
  if (rating >= 3.5) return "#00b67a";
  if (rating >= 2.5) return "#ffad00";
  return "#ff3722";
};

export function StarRating({ rating, label, size = "sm" }: StarRatingProps) {
  const color = ratingColor(rating);
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="inline-flex items-center gap-1" aria-label={label ?? `${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.floor(rating);
        return (
          <svg key={index} viewBox="0 0 24 24" className={iconSize} aria-hidden="true">
            <path
              d="m12 3.6 2.57 5.2 5.74.84-4.16 4.05.98 5.72L12 16.7l-5.13 2.7.98-5.72-4.16-4.05 5.74-.84L12 3.6Z"
              fill={filled ? color : "none"}
              stroke={color}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
