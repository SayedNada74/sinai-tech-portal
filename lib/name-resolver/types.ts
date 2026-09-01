export type ResolutionSource =
  | "exact"
  | "alias"
  | "compound"
  | "arabizi"
  | "fuzzy"
  | "fallback"
  | "unknown";

export interface NameResolutionResult {
  input: string;
  arabic: string | null;
  english: string | null;
  normalized: string;
  source: ResolutionSource;
  confidence: number;
  isKnownName: boolean;
}

export interface FullNameResolutionResult {
  input: string;
  arabic: string;
  english: string;
  confidence: number;
  isKnownName: boolean;
  tokens: NameResolutionResult[];
}
