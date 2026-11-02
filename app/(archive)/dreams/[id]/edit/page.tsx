import { getPageMetadata } from "@/lib/metadata";
import { EditDreamModal } from "@/components/dreams/edit-dream-modal";
import { getDream, getFormSymbols } from "@/lib/data/archive";

export default async function EditDreamPage({ params }: PageProps<"/dreams/[id]/edit">) {
  const { id } = await params;
  const dream = await getDream(id);
  const initialSymbols = await getFormSymbols();
  return <EditDreamModal dream={dream} initialSymbols={initialSymbols} />;
}

export async function generateMetadata() {
  return getPageMetadata("editDream");
}
