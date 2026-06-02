import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "Minha Estante",
  description:
    "Organize os livros que você leu, está lendo ou quer ler. Busque qualquer livro, dê sua nota e monte sua estante pessoal. Funciona offline.",
  applicationName: "Minha Estante",
  openGraph: {
    title: "Minha Estante",
    description: "Sua estante pessoal de livros: lidos, lendo e quero ler.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
