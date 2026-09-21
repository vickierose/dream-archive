export default async function SymbolPage({
  params,
}: PageProps<"/symbols/[id]">) {
  const { id } = await params;

  return <h1>Symbol {id}</h1>;
}
