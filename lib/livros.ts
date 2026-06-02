// Tipos, status e utilidades da estante — lógica pura, sem React.

export type StatusId = "quero" | "lendo" | "lido";

export interface Status {
  id: StatusId;
  label: string;
  color: string;
}

export const STATUSES: Status[] = [
  { id: "quero", label: "Quero ler", color: "#3b82f6" },
  { id: "lendo", label: "Lendo", color: "#f59e0b" },
  { id: "lido", label: "Lido", color: "#16a34a" },
];

export function statusOf(id: StatusId): Status {
  return STATUSES.find((s) => s.id === id) ?? STATUSES[0];
}

/** Resultado bruto da busca (Open Library), antes de virar item da estante. */
export interface BookResult {
  key: string;
  title: string;
  author: string;
  year?: number;
  coverId?: number;
}

/** Livro guardado na estante. */
export interface Book extends BookResult {
  status: StatusId;
  /** Nota de 0 a 5 (0 = sem nota). */
  rating: number;
  addedAt: number;
}

/** URL da capa na Open Library, ou null se o livro não tiver capa. */
export function coverUrl(coverId: number | undefined, size: "M" | "L" = "M"): string | null {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;
}

/** Filtra a estante por status ("todos" mostra tudo) e ordena recentes primeiro. */
export function filterShelf(books: Book[], status: StatusId | "todos"): Book[] {
  const list = status === "todos" ? books : books.filter((b) => b.status === status);
  return [...list].sort((a, b) => b.addedAt - a.addedAt);
}

export type Counts = Record<StatusId | "todos", number>;

export function countByStatus(books: Book[]): Counts {
  return {
    todos: books.length,
    quero: books.filter((b) => b.status === "quero").length,
    lendo: books.filter((b) => b.status === "lendo").length,
    lido: books.filter((b) => b.status === "lido").length,
  };
}
