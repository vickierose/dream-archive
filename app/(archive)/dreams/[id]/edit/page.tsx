import { notFound } from "next/navigation";
import { EditDreamModal } from "@/components/dreams/edit-dream-modal";
import { getDream } from "@/lib/data/archive";

export default async function EditDreamPage({ params }: PageProps<"/dreams/[id]/edit">) {
  const { id } = await params;
  const dream = await getDream(id);
  if (!dream) notFound();
  return <EditDreamModal dream={dream} />;
}
