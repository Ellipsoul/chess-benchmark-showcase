"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>ChessQA Explorer</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {/* Pages first, then the category sections */}
          {[{ href: "/", label: "Home" }, { href: "/about", label: "About" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Separator className="my-2" />
          {NAV_LINKS.filter((link) => link.href.startsWith("/category")).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
