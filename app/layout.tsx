import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ChessQA Explorer",
  description: "How frontier LLMs answer chess questions — every answer, every unedited thought stream.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-slate-200">
          <nav className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 py-3 text-sm whitespace-nowrap">
            <Link href="/" className="font-semibold">ChessQA Explorer</Link>
            <Link href="/category/structural" className="text-slate-600 hover:text-slate-900">Structural</Link>
            <Link href="/category/motifs" className="text-slate-600 hover:text-slate-900">Motifs</Link>
            <Link href="/category/short-tactics" className="text-slate-600 hover:text-slate-900">Short Tactics</Link>
            <Link href="/category/position-judgement" className="text-slate-600 hover:text-slate-900">Position Judgement</Link>
            <Link href="/category/semantic" className="text-slate-600 hover:text-slate-900">Semantic</Link>
            <Link href="/about" className="ml-auto text-slate-600 hover:text-slate-900">About</Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Benchmark: <a className="underline" href="https://github.com/CSSLab/chessqa-benchmark">ChessQA</a> by CSSLab,
          University of Toronto (<a className="underline" href="https://arxiv.org/abs/2510.23948">arXiv:2510.23948</a>, MIT).
          Harness &amp; results: <a className="underline" href="https://github.com/Ellipsoul/chessqa-benchmark">Ellipsoul/chessqa-benchmark</a>.
          Costs shown are real measured API spend.
        </footer>
      </body>
    </html>
  );
}
