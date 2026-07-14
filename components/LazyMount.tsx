"use client";

import { useEffect, useRef, useState } from "react";

export function LazyMount({ children, id, minHeight = 600, eager = false }: {
  children: React.ReactNode;
  /** Anchor id lives on this always-rendered wrapper, so hash/TOC navigation can
   *  target sections whose content has not mounted yet. */
  id?: string;
  minHeight?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Derived, not initial-state: `eager` can flip to true after mount (TOC click on a
  // section that is still a placeholder), and must take effect immediately.
  const show = visible || eager;

  useEffect(() => {
    if (show || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisible(true),
      { rootMargin: "800px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [show]);

  return (
    <div ref={ref} id={id} className="scroll-mt-4" style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
