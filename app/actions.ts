"use server";

import type { BookResult } from "@/lib/livros";

interface RawDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

/**
 * Busca livros pelo título/autor na Open Library (gratuita, sem token).
 * Roda no servidor (Server Action) — o navegador não chama a API direto.
 */
export async function searchBooks(query: string): Promise<BookResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}` +
    `&limit=12&fields=key,title,author_name,first_publish_year,cover_i`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data: { docs?: RawDoc[] } = await res.json();
  return (data.docs ?? []).map((d) => ({
    key: d.key,
    title: d.title,
    author: d.author_name?.[0] ?? "Autor desconhecido",
    year: d.first_publish_year,
    coverId: d.cover_i,
  }));
}
