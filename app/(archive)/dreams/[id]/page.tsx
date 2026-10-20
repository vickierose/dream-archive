import { getPageMetadata } from "@/lib/metadata";
import { getDream } from "@/lib/data/archive";
export default function DreamPage() {
  return null;
}

export async function generateMetadata({ params }: PageProps<"/dreams/[id]">) {
  const { id } = await params;
  const [metadata, dream] = await Promise.all([
    getPageMetadata("dream"),
    getDream(id),
  ]);
  return { ...metadata, title: dream?.title ?? metadata.title };
}
