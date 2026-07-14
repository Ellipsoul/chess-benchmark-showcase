"use client";

import { useEffect, useRef, useState } from "react";

export function LazyMount({ children, minHeight = 600, eager = false }: {
  children: React.ReactNode;
  minHeight?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisible(true),
      { rootMargin: "800px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return <div ref={ref} style={visible ? undefined : { minHeight }}>{visible ? children : null}</div>;
}
