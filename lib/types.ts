// Core data types for RecruiterAI

export const JOB_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];

export const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREEN: 'screen',
  TECH: 'tech',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
} as const;

export type CandidateStage = typeof CANDIDATE_STAGES[keyof typeof CANDIDATE_STAGES];

export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  NUMERIC: 'numeric',
  FILE_UPLOAD: 'file_upload',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

export const STAGE_COLORS: Record<CandidateStage, string> = {
  [CANDIDATE_STAGES.APPLIED]: 'bg-blue-100 text-blue-800',
  [CANDIDATE_STAGES.SCREEN]: 'bg-yellow-100 text-yellow-800',
  [CANDIDATE_STAGES.TECH]: 'bg-purple-100 text-purple-800',
  [CANDIDATE_STAGES.OFFER]: 'bg-green-100 text-green-800',
  [CANDIDATE_STAGES.HIRED]: 'bg-emerald-100 text-emerald-800',
  [CANDIDATE_STAGES.REJECTED]: 'bg-red-100 text-red-800',
};

export const STAGE_LABELS: Record<CandidateStage, string> = {
  [CANDIDATE_STAGES.APPLIED]: 'Applied',
  [CANDIDATE_STAGES.SCREEN]: 'Phone Screen',
  [CANDIDATE_STAGES.TECH]: 'Technical Interview',
  [CANDIDATE_STAGES.OFFER]: 'Offer Extended',
  [CANDIDATE_STAGES.HIRED]: 'Hired',
  [CANDIDATE_STAGES.REJECTED]: 'Rejected',
};

// Type definitions
export interface Job {
  id: string | number;
  title: string;
  slug: string;
  status: JobStatus;
  tags: string[];
  order: number;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  salary: string;
  type: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  stage: CandidateStage;
  jobId: string | number | null;
  jobTitle?: string;
  resume: string | null;
  coverLetter: string | null;
  notes: Note[];
  timeline: TimelineEvent[];
  assessmentResponses: Record<string, AssessmentResponse>;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionValidation {
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  pattern: string | null;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  options: string[];
  validation: QuestionValidation;
  conditionalLogic: unknown | null;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  order: number;
}

export interface AssessmentSettings {
  timeLimit: number | null;
  allowMultipleAttempts: boolean;
  showResults: boolean;
}

export interface Assessment {
  id: string | number;
  jobId: string | number | null;
  title: string;
  description: string;
  sections: Section[];
  settings: AssessmentSettings;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  candidateId: string | number | null;
  type: string;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Note {
  id: string;
  candidateId: string | number | null;
  content: string;
  mentions: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  id: string;
  candidateId: string | number | null;
  assessmentId: string | number | null;
  responses: Record<string, unknown>;
  score: number | null;
  completedAt: string | null;
  timeSpent: number | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchOptions {
  search: string;
  page: number;
  pageSize: number;
  sort: string;
  order: 'asc' | 'desc';
  filters: Record<string, unknown>;
}

export interface AppError {
  type: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// Factory functions
export const createJob = (overrides: Partial<Job> = {}): Job => ({
  id: overrides.id || crypto.randomUUID(),
  title: '',
  slug: '',
  status: JOB_STATUS.ACTIVE,
  tags: [],
  order: 0,
  description: '',
  requirements: [],
  benefits: [],
  location: '',
  salary: '',
  type: 'full-time',
  department: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createCandidate = (overrides: Partial<Candidate> = {}): Candidate => ({
  id: overrides.id || crypto.randomUUID(),
  name: '',
  email: '',
  phone: '',
  stage: CANDIDATE_STAGES.APPLIED,
  jobId: null,
  resume: null,
  coverLetter: null,
  notes: [],
  timeline: [],
  assessmentResponses: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createAssessment = (overrides: Partial<Assessment> = {}): Assessment => ({
  id: overrides.id || crypto.randomUUID(),
  jobId: null,
  title: '',
  description: '',
  sections: [],
  settings: {
    timeLimit: null,
    allowMultipleAttempts: false,
    showResults: false,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: crypto.randomUUID(),
  type: QUESTION_TYPES.SHORT_TEXT,
  title: '',
  description: '',
  required: false,
  options: [],
  validation: {
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    pattern: null,
  },
  conditionalLogic: null,
  order: 0,
  ...overrides,
});

export const createSection = (overrides: Partial<Section> = {}): Section => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  questions: [],
  order: 0,
  ...overrides,
});

export const createTimelineEvent = (overrides: Partial<TimelineEvent> = {}): TimelineEvent => ({
  id: crypto.randomUUID(),
  candidateId: null,
  type: 'stage_change',
  title: '',
  description: '',
  metadata: {},
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createNote = (overrides: Partial<Note> = {}): Note => ({
  id: crypto.randomUUID(),
  candidateId: null,
  content: '',
  mentions: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createAssessmentResponse = (overrides: Partial<AssessmentResponse> = {}): AssessmentResponse => ({
  id: crypto.randomUUID(),
  candidateId: null,
  assessmentId: null,
  responses: {},
  score: null,
  completedAt: null,
  timeSpent: null,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createApiResponse = <T>(data: T, success = true, message = ''): ApiResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const createPaginationMeta = (page: number, pageSize: number, total: number, hasMore = false): PaginationMeta => ({
  page,
  pageSize,
  total,
  totalPages: Math.ceil(total / pageSize),
  hasMore,
});

export const createSearchOptions = (overrides: Partial<SearchOptions> = {}): SearchOptions => ({
  search: '',
  page: 1,
  pageSize: 20,
  sort: 'createdAt',
  order: 'desc',
  filters: {},
  ...overrides,
});

export const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  NETWORK_ERROR: 'network_error',
  SERVER_ERROR: 'server_error',
} as const;

export const createError = (type: string, message: string, details: Record<string, unknown> = {}): AppError => ({
  type,
  message,
  details,
  timestamp: new Date().toISOString(),
});
