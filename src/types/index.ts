/**
 * Wire-contract types for the Cruiser Copilot frontend.
 *
 * These are hand-written TypeScript mirrors of the zod schemas that live in
 * the backend (`cruiser-copilot-backend/src/lib/validation/schemas.ts`), the
 * single source of truth for validation. The frontend only ever receives
 * already-validated JSON from the backend, so it does not need zod itself —
 * these types exist purely to keep component code type-safe.
 *
 * If the backend contract changes, update this file to match.
 */

export type Series = "70" | "80" | "unknown";
export type EngineCode = "1HZ" | "1HD-T" | "unknown";
export type AcsdConfiguration = "present" | "absent" | "unknown";
export type IdentificationConfidence = "user-confirmed" | "inferred" | "unknown";

export interface Vehicle {
  id: string;
  manufacturer?: string;
  modelName?: string;
  submodel?: string;
  vin?: string;
  series: Series;
  modelCode?: string;
  chassisCode?: string;
  productionYear?: number;
  productionDate?: string;
  market?: string;
  engineCode: EngineCode;
  transmission?: string;
  pumpModel?: string;
  emissionsConfiguration?: string;
  acsdConfiguration?: AcsdConfiguration;
  modifications: string[];
  identificationConfidence: IdentificationConfidence;
}

/** Fields that must be known before an exact specification may be selected. */
export const APPLICABILITY_FIELDS = [
  "manufacturer",
  "modelName",
  "submodel",
  "series",
  "modelCode",
  "productionYear",
  "productionDate",
  "market",
  "engineCode",
  "pumpModel",
  "emissionsConfiguration",
  "acsdConfiguration",
] as const;

export type ApplicabilityField = (typeof APPLICABILITY_FIELDS)[number];

export type SourceType =
  | "service_bulletin"
  | "oem_manual"
  | "oem_technical"
  | "verified_case"
  | "technician"
  | "forum"
  | "general";

export type LicenseStatus = "owned" | "licensed" | "permission_granted" | "unknown";

export interface SourceDocument {
  id: string;
  sourceType: SourceType;
  title: string;
  manufacturer?: string;
  documentNumber?: string;
  revision?: string;
  publicationDate?: string;
  url?: string;
  authorityLevel: number;
  licenseStatus: LicenseStatus;
  isPlaceholder: boolean;
}

export interface SourcePassage {
  id: string;
  sourceDocumentId: string;
  text: string;
  pageNumber?: number;
  section?: string;
  postNumber?: string;
  manufacturers: string[];
  modelNames: string[];
  submodels: string[];
  modelCodes: string[];
  engineCodes: string[];
  markets: string[];
  yearStart?: number;
  yearEnd?: number;
  pumpModels: string[];
  acsdStates: AcsdConfiguration[];
  emissionsConfigurations: string[];
  diagramRef?: string;
  keywords: string[];
  specificationSubject?: string;
  specificationValue?: string;
}

export interface Citation {
  id: string;
  sourceDocumentId: string;
  sourcePassageId: string;
  label: string;
  locator: string;
  sourceType: SourceType;
  authorityLevel: number;
  url?: string;
  isPlaceholder: boolean;
}

export interface SourceConflict {
  id: string;
  subject: string;
  alternatives: Array<{
    value: string;
    citationId: string;
    applicabilitySummary: string;
  }>;
  missingApplicabilityFields: string[];
  resolutionStatus: "unresolved" | "resolved";
  explanation: string;
}

export type EvidenceType = "photo" | "video" | "audio" | "measurement" | "code" | "observation";

export interface CaptureConditions {
  engineTemperature: "cold" | "warm" | "unknown";
  timing?: string;
  relationToRepair: "before" | "after" | "unknown";
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  userDescription?: string;
  machineObservation?: string;
  observationLimit?: string;
  captureConditions?: CaptureConditions;
  provenance: "user" | "model";
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt: string;
  measurement?: { key: string; value: number; unit: string };
}

export interface DiagnosticAnswer {
  questionId: string;
  value: string;
  freeText?: string;
  answeredAt: string;
}

export type VisualFocus =
  | "front-three-quarter"
  | "driver-side"
  | "rear-three-quarter"
  | "rear-exhaust"
  | "engine-bay"
  | "dashboard"
  | "pump-detail";

export interface Question {
  id: string;
  prompt: string;
  helpText?: string;
  kind: "single-select" | "free-text";
  options: Array<{ value: string; label: string; description?: string }>;
  visualFocus: VisualFocus;
  rationale: string;
}

export type HypothesisStatus =
  | "untested"
  | "partially-tested"
  | "supported"
  | "contradicted"
  | "confirmed";

export interface EvidenceLink {
  ref: string;
  label: string;
  direction: "supports" | "contradicts" | "context";
  note: string;
}

export interface Hypothesis {
  id: string;
  name: string;
  summary: string;
  relativeScore: number;
  status: HypothesisStatus;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  missingEvidence: string[];
  rationale: EvidenceLink[];
}

export interface RecommendedTest {
  id: string;
  name: string;
  reason: string;
  difficulty: "basic" | "intermediate" | "advanced";
  estimatedMinutes: number;
  requiredTools: string[];
  safetyWarnings: string[];
  possibleInterpretations: string[];
  procedureId?: string;
  targetsHypothesisIds: string[];
}

export interface ProcedureStep {
  id: string;
  order: number;
  instruction: string;
  oemNotes: string[];
  communityTips: string[];
  specificationSubject?: string;
  requiredTools: string[];
  safetyWarnings: string[];
  stopConditions: string[];
  photoCheckpoint?: string;
  diagramRef?: string;
  citationIds: string[];
}

export interface Procedure {
  id: string;
  title: string;
  summary: string;
  appliesTo: { series: Series[]; engineCodes: EngineCode[] };
  difficulty: "basic" | "intermediate" | "advanced";
  estimatedMinutes: number;
  globalSafetyWarnings: string[];
  requiredTools: string[];
  steps: ProcedureStep[];
  validationSteps: string[];
  visualFocus: VisualFocus;
}

export type SessionStage = "vehicle" | "symptoms" | "evidence" | "testing" | "repair" | "complete";

export interface Outcome {
  resolved: "yes" | "no" | "partially" | "unknown";
  performedTestIds: string[];
  notes?: string;
  recordedAt: string;
}

export interface DiagnosticSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  complaint: string;
  stage: SessionStage;
  answers: DiagnosticAnswer[];
  evidence: EvidenceItem[];
  completedStepIds: string[];
  outcome?: Outcome;
  mode: "scripted" | "live";
}

export interface SafetyGate {
  id: string;
  severity: "info" | "caution" | "blocking";
  title: string;
  detail: string;
  missingApplicabilityFields: string[];
}

export interface DiagnosticUpdate {
  vehicleStatus: { identified: boolean; missingFields: string[] };
  summary: string;
  explanation?: string;
  explanationSource: "scripted" | "model";
  hypotheses: Hypothesis[];
  nextQuestion: Question | null;
  recommendedTest: RecommendedTest | null;
  sourceConflicts: SourceConflict[];
  citations: Citation[];
  safetyGates: SafetyGate[];
  specificationLocked: boolean;
  stage: SessionStage;
  progress: {
    vehicleIdentified: boolean;
    symptomsCaptured: boolean;
    evidenceCaptured: boolean;
    testingStarted: boolean;
    outcomeRecorded: boolean;
  };
}

export interface ModelExplanation {
  explanation: string;
  citedCitationIds: string[];
  observations: string[];
  reportedConflicts: string[];
  missingApplicabilityFields: string[];
}

export interface MediaObservationOutput {
  observations: string[];
  observationLimit: string;
  isDiagnosis: false;
}
