export default async function DreamPage({
  params,
}: PageProps<"/dreams/[id]">) {
  const { id } = await params;

  return <h1>Dream {id}</h1>;
}
