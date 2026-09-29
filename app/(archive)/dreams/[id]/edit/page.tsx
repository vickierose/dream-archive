import { notFound } from "next/navigation";
import { EditDreamModal } from "@/components/edit-dream-modal";
import { mockDreams } from "@/data/mock-dreams";

export default async function EditDreamPage({ params }: PageProps<"/dreams/[id]/edit">) {
  const { id } = await params;
  const dream = mockDreams.find((dream) => dream.id === id);
  if (!dream) notFound();
  return <EditDreamModal dream={dream} />;
}
