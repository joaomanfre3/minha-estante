"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { type Book, type StatusId, STATUSES } from "@/lib/livros";
import { BookCover } from "./BookCover";
import { StarRating } from "./StarRating";

interface BookDetailProps {
  book: Book | null;
  onClose: () => void;
  onSetStatus: (status: StatusId) => void;
  onSetRating: (rating: number) => void;
  onRemove: () => void;
}

export function BookDetail({
  book,
  onClose,
  onSetStatus,
  onSetRating,
  onRemove,
}: BookDetailProps) {
  return (
    <AnimatePresence>
      {book && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-paper p-5 pb-8 shadow-2xl"
            style={{ backgroundColor: "var(--color-paper)" }}
          >
            <div className="mb-4 flex justify-end">
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cabeçalho com capa */}
            <div className="flex gap-4">
              <div className="book-shadow h-32 w-24 shrink-0 overflow-hidden rounded-lg">
                <BookCover coverId={book.coverId} title={book.title} size="L" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl font-bold leading-snug">{book.title}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {book.author}
                  {book.year ? ` · ${book.year}` : ""}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink/60">Status</p>
              <div className="flex gap-2">
                {STATUSES.map((s) => {
                  const active = s.id === book.status;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSetStatus(s.id)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                        active ? "text-white" : "bg-black/5 text-ink/60 hover:bg-black/10"
                      }`}
                      style={active ? { backgroundColor: s.color } : undefined}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nota */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-medium text-ink/60">Sua nota</p>
              <StarRating value={book.rating} size={26} onChange={onSetRating} />
            </div>

            {/* Remover */}
            <button
              onClick={onRemove}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100"
            >
              <Trash2 size={16} /> Remover da estante
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
