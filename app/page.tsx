"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Library, Plus, Star } from "lucide-react";
import {
  type Book,
  type BookResult,
  type StatusId,
  countByStatus,
  filterShelf,
  statusOf,
} from "@/lib/livros";
import { BookCover } from "@/components/BookCover";
import { BookSearch } from "@/components/BookSearch";
import { BookDetail } from "@/components/BookDetail";

const STORAGE_KEY = "minha-estante:v1";
const TABS: { id: StatusId | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "quero", label: "Quero ler" },
  { id: "lendo", label: "Lendo" },
  { id: "lido", label: "Lidos" },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<StatusId | "todos">("todos");
  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Carrega a estante salva.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBooks(JSON.parse(raw));
    } catch {
      /* localStorage indisponível */
    }
    setHydrated(true);
  }, []);

  // Persiste a cada mudança.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      /* cota cheia / modo privado */
    }
  }, [books, hydrated]);

  const counts = useMemo(() => countByStatus(books), [books]);
  const visible = useMemo(() => filterShelf(books, filter), [books, filter]);
  const detailBook = books.find((b) => b.key === detailId) ?? null;

  function addBook(result: BookResult) {
    setBooks((prev) =>
      prev.some((b) => b.key === result.key)
        ? prev
        : [...prev, { ...result, status: "quero", rating: 0, addedAt: Date.now() }],
    );
    setSearchOpen(false);
  }

  function updateBook(key: string, patch: Partial<Book>) {
    setBooks((prev) => prev.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  }

  function removeBook(key: string) {
    setBooks((prev) => prev.filter((b) => b.key !== key));
    setDetailId(null);
  }

  if (!hydrated) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-8 pb-28">
      {/* Cabeçalho */}
      <header>
        <div className="flex items-center gap-2">
          <Library size={26} style={{ color: "var(--color-accent)" }} />
          <h1 className="font-serif text-2xl font-bold tracking-tight">Minha Estante</h1>
        </div>
        {books.length > 0 && (
          <p className="mt-1 text-sm text-ink/50">
            {counts.lido} {counts.lido === 1 ? "livro lido" : "livros lidos"} ·{" "}
            {counts.lendo} lendo · {counts.quero} na fila
          </p>
        )}
      </header>

      {/* Abas de status */}
      {books.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-black/5 p-1">
          {TABS.map((tab) => {
            const active = tab.id === filter;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className="relative shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition"
              >
                {active && (
                  <motion.span
                    layoutId="shelf-tab"
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`relative ${active ? "text-accent" : "text-ink/50"}`}>
                  {tab.label} ({counts[tab.id]})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Estante */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-ink/40">
          <Library size={30} strokeWidth={1.5} />
          <p className="text-sm">
            {books.length === 0
              ? "Sua estante está vazia. Busque um livro pra começar!"
              : "Nenhum livro nesta prateleira."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          <AnimatePresence initial={false}>
            {visible.map((book) => {
              const status = statusOf(book.status);
              return (
                <motion.li
                  key={book.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <button onClick={() => setDetailId(book.key)} className="group w-full text-left">
                    <div className="book-shadow relative aspect-[2/3] overflow-hidden rounded-lg transition group-hover:-translate-y-1">
                      <BookCover coverId={book.coverId} title={book.title} />
                      {/* Selo de status */}
                      <span
                        className="absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow"
                        style={{ backgroundColor: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-tight">
                      {book.title}
                    </p>
                    {book.rating > 0 && (
                      <span className="mt-0.5 flex items-center gap-0.5 text-[11px] text-amber-500">
                        <Star size={11} className="fill-amber-400 text-amber-400" /> {book.rating}
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => setSearchOpen(true)}
        aria-label="Adicionar livro"
        className="fixed bottom-6 left-1/2 z-30 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full px-6 font-bold text-white shadow-xl shadow-emerald-700/25 transition active:scale-95"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <Plus size={20} /> Adicionar livro
      </button>

      <BookSearch
        open={searchOpen}
        ownedKeys={books.map((b) => b.key)}
        onClose={() => setSearchOpen(false)}
        onAdd={addBook}
      />

      <BookDetail
        book={detailBook}
        onClose={() => setDetailId(null)}
        onSetStatus={(status) => detailBook && updateBook(detailBook.key, { status })}
        onSetRating={(rating) => detailBook && updateBook(detailBook.key, { rating })}
        onRemove={() => detailBook && removeBook(detailBook.key)}
      />
    </main>
  );
}
