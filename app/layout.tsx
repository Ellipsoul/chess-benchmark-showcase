import type { Metadata } from "next";
import { Geist, Geist_Mono, Literata } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ChessQA Explorer",
  description: "How frontier LLMs answer chess questions — every answer, every unedited thought stream.",
};

// Tiny 2x2 board glyph in the classic cream/walnut duo — the site's mark.
function BoardGlyph() {
  return (
    <span aria-hidden className="grid h-4 w-4 shrink-0 grid-cols-2 overflow-hidden rounded-[3px]">
      <span className="bg-[#f0d9b5]" />
      <span className="bg-[#b58863]" />
      <span className="bg-[#b58863]" />
      <span className="bg-[#f0d9b5]" />
    </span>
  );
}

const navLink = "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-stone-200 dark:border-stone-800">
          <nav className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-3 text-sm whitespace-nowrap">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BoardGlyph />
              ChessQA Explorer
            </Link>
            <Link href="/category/structural" className={navLink}>Structural</Link>
            <Link href="/category/motifs" className={navLink}>Motifs</Link>
            <Link href="/category/short-tactics" className={navLink}>Short Tactics</Link>
            <Link href="/category/position-judgement" className={navLink}>Position Judgement</Link>
            <Link href="/category/semantic" className={navLink}>Semantic</Link>
            <Link href="/about" className={`ml-auto ${navLink}`}>About</Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-16 border-t border-stone-200 py-6 text-center text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
          Benchmark: <a className="underline" href="https://github.com/CSSLab/chessqa-benchmark">ChessQA</a> by CSSLab,
          University of Toronto (<a className="underline" href="https://arxiv.org/abs/2510.23948">arXiv:2510.23948</a>, MIT).
          Harness &amp; results: <a className="underline" href="https://github.com/Ellipsoul/chessqa-benchmark">Ellipsoul/chessqa-benchmark</a>.
          Costs shown are real measured API spend.
        </footer>
      </body>
    </html>
  );
}
