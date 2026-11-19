// Type declarations for the plain-JS lawn guide package.

export type IssueKey = "bare" | "weeds" | "dry" | "thin" | "shade";

export interface GuideIssue {
  label: string;
  keywords: string[];
  tip: string;
  weeks: number[];
}

export interface GrassType {
  label: string;
  season: "cool" | "warm" | "unknown";
  mow: { height: string; frequency: string };
  water: { amount: string; timing: string };
  fertilize: string;
}

export interface LawnGuide {
  grassTypes: Record<string, GrassType>;
  issues: Record<IssueKey, GuideIssue>;
  regions: Record<string, { name: string; climate: string }>;
  climateNotes: Record<string, string>;
  seedingMonths: Record<GrassType["season"], number[]>;
  weekTitles: string[];
}

export declare const lawnGuide: LawnGuide;

export declare function detectIssues(
  currentDescription: string,
  desiredDescription: string,
): Array<GuideIssue & { key: IssueKey }>;

export interface RuleBasedPlanWeek {
  week: number;
  title: string;
  mow: string;
  water: string;
  fertilize: string;
  extra: string[];
}

export interface RuleBasedPlan {
  summary: string;
  region: { name: string; climate: string };
  grassLabel: string;
  issues: Array<GuideIssue & { key: IssueKey }>;
  weeks: RuleBasedPlanWeek[];
}

export declare function generatePlan(inputs: {
  zip: string;
  grassType: string;
  currentDescription?: string;
  desiredDescription?: string;
  currentPhotoCount?: number;
  desiredPhotoCount?: number;
  issueKeys?: string[];
}): RuleBasedPlan;
