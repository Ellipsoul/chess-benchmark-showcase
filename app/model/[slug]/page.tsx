import { promises as fs } from "fs";
import path from "path";
import { ModelClient } from "@/components/ModelClient";

export async function generateStaticParams() {
  const raw = await fs.readFile(path.join(process.cwd(), "public", "data", "index.json"), "utf-8");
  const index = JSON.parse(raw) as { runs: { slug: string }[] };
  return index.runs.map((run) => ({ slug: run.slug }));
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ModelClient slug={slug} />;
}
