"use client";

import { useState } from "react";
import { BookText } from "lucide-react";
import { coverUrl } from "@/lib/livros";

interface BookCoverProps {
  coverId?: number;
  title: string;
  size?: "M" | "L";
  className?: string;
}

/** Capa do livro com fallback elegante quando não há imagem (ou ela falha). */
export function BookCover({ coverId, title, size = "M", className = "" }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const url = coverUrl(coverId, size);

  if (!url || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-800 to-emerald-950 p-3 text-center text-white ${className}`}
      >
        <BookText size={22} className="opacity-70" />
        <span className="line-clamp-3 font-serif text-xs leading-tight">{title}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`Capa de ${title}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
