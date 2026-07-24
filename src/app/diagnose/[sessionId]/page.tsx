import { DiagnosticWorkspace } from "@/components/diagnosis/DiagnosticWorkspace";

export default async function DiagnosePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <DiagnosticWorkspace sessionId={sessionId} />;
}
