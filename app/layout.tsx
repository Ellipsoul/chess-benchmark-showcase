import type { Metadata } from "next";
import { Geist, Geist_Mono, Literata } from "next/font/google";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/nav";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b">
          <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 text-sm">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BoardGlyph />
              ChessQA Explorer
            </Link>
            <nav className="hidden items-center gap-5 md:flex">
              {NAV_LINKS.slice(0, -1).map((link) => (
                <Link key={link.href} href={link.href} className="text-foreground/75 hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center">
              <Link href="/about" className="hidden text-foreground/75 hover:text-foreground md:block">
                About
              </Link>
              <MobileNav />
            </div>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-16 border-t py-6 text-center text-xs text-muted-foreground">
          Benchmark: <a className="underline" href="https://github.com/CSSLab/chessqa-benchmark" target="_blank" rel="noreferrer">ChessQA</a> by CSSLab,
          University of Toronto (<a className="underline" href="https://arxiv.org/abs/2510.23948" target="_blank" rel="noreferrer">arXiv:2510.23948</a>, MIT).
          Harness &amp; results: <a className="underline" href="https://github.com/Ellipsoul/chessqa-benchmark" target="_blank" rel="noreferrer">Ellipsoul/chessqa-benchmark</a>.
          This site: <a className="underline" href="https://github.com/Ellipsoul/chess-benchmark-showcase" target="_blank" rel="noreferrer">Ellipsoul/chess-benchmark-showcase</a>.
          Costs shown are real measured API spend.
        </footer>
      </body>
    </html>
  );
}
