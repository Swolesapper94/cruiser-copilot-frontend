"use client";

import type {
  Citation,
  DiagnosticSession,
  DiagnosticUpdate,
  Procedure,
  SafetyGate,
} from "@/types";

export interface SessionPayload {
  contractVersion: string;
  sessionAccessToken?: string;
  session: DiagnosticSession;
  update: DiagnosticUpdate;
}

export interface ProcedurePayload {
  contractVersion: string;
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
export const API_CONTRACT_VERSION = "2026-09-01";

function tokenKey(sessionId: string): string {
  return `cruiser-copilot:session:${sessionId}`;
}

function sessionToken(sessionId: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(tokenKey(sessionId)) ?? undefined;
}

function rememberSessionToken(sessionId: string, token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(tokenKey(sessionId), token);
}

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
  init?: RequestInit & { json?: unknown; sessionId?: string },
): Promise<T> {
  const { json, sessionId, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  if (json) headers.set("content-type", "application/json");
  const accessToken = sessionId ? sessionToken(sessionId) : undefined;
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
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
  const payload = (await response.json()) as T & { contractVersion?: string };
  if (
    payload.contractVersion !== undefined &&
    payload.contractVersion !== API_CONTRACT_VERSION
  ) {
    throw new ApiError("api_contract_mismatch", 502);
  }
  return payload;
}

export const api = {
  createSession: async (complaint?: string) => {
    const payload = await request<SessionPayload>("/api/sessions", {
      method: "POST",
      json: { complaint },
    });
    if (!payload.sessionAccessToken) throw new ApiError("session_token_missing", 502);
    rememberSessionToken(payload.session.id, payload.sessionAccessToken);
    return payload;
  },

  getSession: (id: string) =>
    request<SessionPayload>(`/api/sessions/${id}`, { sessionId: id }),

  patchVehicle: (id: string, patch: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/vehicle`, {
      method: "PATCH",
      json: patch,
      sessionId: id,
    }),

  answer: (id: string, questionId: string, value: string, freeText?: string) =>
    request<SessionPayload>(`/api/sessions/${id}/answers`, {
      method: "POST",
      json: { questionId, value, freeText },
      sessionId: id,
    }),

  addEvidence: (id: string, evidence: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/evidence`, {
      method: "POST",
      json: evidence,
      sessionId: id,
    }),

  analyze: (id: string) =>
    request<SessionPayload>(`/api/sessions/${id}/analyze`, {
      method: "POST",
      sessionId: id,
    }),

  setStep: (id: string, stepId: string, completed: boolean) =>
    request<SessionPayload>(`/api/sessions/${id}/steps`, {
      method: "POST",
      json: { stepId, completed },
      sessionId: id,
    }),

  recordOutcome: (id: string, outcome: Record<string, unknown>) =>
    request<SessionPayload>(`/api/sessions/${id}/outcome`, {
      method: "POST",
      json: outcome,
      sessionId: id,
    }),

  getProcedure: (procedureId: string, sessionId?: string) =>
    request<ProcedurePayload>(
      `/api/procedures/${encodeURIComponent(procedureId)}${
        sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : ""
      }`,
      { sessionId },
    ),
};
