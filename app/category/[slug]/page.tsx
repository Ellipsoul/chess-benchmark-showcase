import { Suspense } from "react";
import { CategoryClient } from "@/components/CategoryClient";
import { CATEGORY_ORDER } from "@/lib/outcome";

export function generateStaticParams() {
  return CATEGORY_ORDER.map(({ slug }) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense>
      <CategoryClient slug={slug} />
    </Suspense>
  );
}
