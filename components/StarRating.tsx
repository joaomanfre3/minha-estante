"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  /** Quando read-only, não responde a cliques (usado no cartão). */
  readOnly?: boolean;
  size?: number;
  onChange?: (value: number) => void;
}

export function StarRating({ value, readOnly, size = 20, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
            // Clicar na mesma estrela já marcada zera a nota.
            onClick={() => onChange?.(value === star ? 0 : star)}
            className={readOnly ? "cursor-default" : "transition active:scale-90"}
          >
            <Star
              size={size}
              className={filled ? "fill-amber-400 text-amber-400" : "text-black/20"}
            />
          </button>
        );
      })}
    </div>
  );
}
