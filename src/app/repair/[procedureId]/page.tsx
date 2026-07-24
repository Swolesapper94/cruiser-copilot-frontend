import { RepairWorkspace } from "@/components/repair/RepairWorkspace";

export default async function RepairPage({
  params,
  searchParams,
}: {
  params: Promise<{ procedureId: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const [{ procedureId }, { sessionId }] = await Promise.all([
    params,
    searchParams,
  ]);

  return <RepairWorkspace procedureId={procedureId} sessionId={sessionId} />;
}
