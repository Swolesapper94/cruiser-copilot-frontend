"use client";

import type {
  Citation,
  DiagnosticSession,
  DiagnosticUpdate,
  Procedure,
  SafetyGate,
} from "@/types";

export interface SessionPayload {
  session: DiagnosticSession;
  update: DiagnosticUpdate;
}

export interface ProcedurePayload {
  procedure: Procedure;
  citations: Citation[];
  specificationLocked: boolean;
  safetyGates: SafetyGate[];
  completedStepIds: string[];
}

/**
 * The backend is a separate service/repo. Point this at wherever it is
 * running — see `.env.example`.
 */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(
  /\/$/,
  "",
);

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, ...rest } = init ?? {};
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: json ? { "content-type": "application/json" } : undefined,
    body: json ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });

  if (!response.ok) {
    let code = `http_${response.status}`;
    try {
      const body = (await response.json()) as { error?: { code?: string } };
      code = body.error?.code ?? code;
    } catch {
      // Response had no JSON body. The status code is enough.
    }
    throw new ApiError(code, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  createSession: (complaint?: string) =>
    request<SessionPayload>("/api/sessions", {
      method: "POST",
      json: { complaint },
    }),

  getSession: (id: string) => request<SessionPayload>(`/api/sessions/${id}`),

  patchVehicle: (id: string, patch: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/vehicle`, {
      method: "PATCH",
      json: patch,
    }),

  answer: (id: string, questionId: string, value: string, freeText?: string) =>
    request<SessionPayload>(`/api/sessions/${id}/answers`, {
      method: "POST",
      json: { questionId, value, freeText },
    }),

  addEvidence: (id: string, evidence: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/evidence`, {
      method: "POST",
      json: evidence,
    }),

  analyze: (id: string) =>
    request<SessionPayload>(`/api/sessions/${id}/analyze`, { method: "POST" }),

  setStep: (id: string, stepId: string, completed: boolean) =>
    request<SessionPayload>(`/api/sessions/${id}/steps`, {
      method: "POST",
      json: { stepId, completed },
    }),

  recordOutcome: (id: string, outcome: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/outcome`, {
      method: "POST",
      json: outcome,
    }),

  getProcedure: (procedureId: string, sessionId?: string) =>
    request<ProcedurePayload>(
      `/api/procedures/${procedureId}${sessionId ? `?sessionId=${sessionId}` : ""}`,
    ),
};
