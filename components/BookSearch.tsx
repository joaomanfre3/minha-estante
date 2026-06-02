"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import { type BookResult } from "@/lib/livros";
import { searchBooks } from "@/app/actions";
import { BookCover } from "./BookCover";

interface BookSearchProps {
  open: boolean;
  ownedKeys: string[];
  onClose: () => void;
  onAdd: (book: BookResult) => void;
}

export function BookSearch({ open, ownedKeys, onClose, onAdd }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca com debounce de 400ms.
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      setResults(await searchBooks(query));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, open]);

  // Limpa ao fechar.
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-3xl bg-paper p-5 pb-8 shadow-2xl"
            style={{ backgroundColor: "var(--color-paper)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">Adicionar livro</h3>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Busca */}
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4">
              <Search size={18} className="text-ink/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título ou autor"
                className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink/40"
              />
              {loading && <Loader2 size={18} className="animate-spin text-ink/40" />}
            </div>

            {/* Resultados */}
            <ul className="flex flex-col gap-2 overflow-y-auto">
              {results.map((book) => {
                const owned = ownedKeys.includes(book.key);
                return (
                  <li key={book.key}>
                    <button
                      disabled={owned}
                      onClick={() => onAdd(book)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition enabled:hover:bg-black/5 disabled:opacity-50"
                    >
                      <div className="book-shadow h-16 w-11 shrink-0 overflow-hidden rounded">
                        <BookCover coverId={book.coverId} title={book.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{book.title}</p>
                        <p className="truncate text-sm text-ink/50">
                          {book.author}
                          {book.year ? ` · ${book.year}` : ""}
                        </p>
                      </div>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          owned ? "text-emerald-600" : "bg-emerald-600 text-white"
                        }`}
                      >
                        {owned ? <Check size={18} /> : <Plus size={18} />}
                      </span>
                    </button>
                  </li>
                );
              })}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <li className="py-8 text-center text-sm text-ink/40">
                  Nenhum livro encontrado.
                </li>
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
