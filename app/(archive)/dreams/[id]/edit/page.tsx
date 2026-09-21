export default async function EditDreamPage({
  params,
}: PageProps<"/dreams/[id]/edit">) {
  const { id } = await params;

  return <h1>Edit dream {id}</h1>;
}
