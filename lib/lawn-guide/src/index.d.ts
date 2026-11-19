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
  noFeedingMonths: Record<GrassType["season"], number[]>;
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

// planRules.js
export declare const MONTHS: string[];
export declare const RESEED_REMINDER: string;
export type PlanTopic = "seeding" | "weeds" | "shade";
export declare const TOPIC_PATTERNS: Record<PlanTopic, { allowedBy: IssueKey[]; pattern: RegExp }>;
export interface PlanWeekDates {
  week: number;
  start: Date;
  end: Date;
  dates: string;
}
export declare function seasonOf(date: Date): string;
export declare function planWeeks(today: string): PlanWeekDates[];
export declare function seedingWeek(today: string, season: GrassType["season"]): number | null;
export declare function feedingAllowed(grassType: string, zip: string, date: Date): boolean;
export declare function saysNoFeeding(text: string): boolean;
export declare function titleSeasonMismatch(title: string, week: PlanWeekDates): string | null;
export declare function amountsIn(text: string): string[];
export declare function allowedAmounts(grassType: string, issueKeys: string[]): Set<string>;
