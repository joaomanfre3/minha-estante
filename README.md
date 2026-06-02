# 📚 Minha Estante

Organize os livros que você leu, está lendo ou quer ler. Busque qualquer livro de verdade, dê sua nota e monte sua estante pessoal — tudo salvo no navegador, sem cadastro.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Server Actions](https://img.shields.io/badge/Server_Actions-000?logo=nextdotjs&logoColor=white)

## O que faz

- **Busca de livros reais** com capa, autor e ano (base da Open Library)
- **Três prateleiras**: Quero ler · Lendo · Lido
- **Nota** de 1 a 5 estrelas pra cada livro
- Estante em **grade de capas**, com filtro por status
- Resumo: quantos lidos, lendo e na fila
- **Salva sozinho** no navegador — sua estante continua lá
- 100% **responsivo**

## O diferencial técnico

A busca de livros acontece numa **Next.js Server Action** (`app/actions.ts`): o navegador não chama a API direto — quem busca é o servidor, que devolve só título, autor, ano e id da capa. As capas vêm da [Open Library](https://openlibrary.org/), com um fallback elegante quando o livro não tem imagem.

A Open Library é **gratuita e sem token**, então o projeto roda na Vercel sem nenhuma variável de ambiente.

## Stack

Next.js 16 (App Router + Server Actions) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide. Sem banco — a estante fica no `localStorage`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy

Pronto pra Vercel — importe o repositório, build padrão (`next build`), zero variáveis de ambiente.

---

Feito por [@joaomanfre3](https://github.com/joaomanfre3).
