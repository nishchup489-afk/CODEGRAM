import { ActivityClass, ActivityType, EntrySource } from "./enums/activity";

// ============================================================
// COMMON TYPES
// ============================================================

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };


export type JsonObject = {
  [key: string]: JsonValue;
};


// ============================================================
// ACTIVITY ENTRY
// ============================================================

export interface ActivityEntryCreate {
  project_id?: string | null;

  title: string;

  activity_class: ActivityClass;
  activity_type: ActivityType;

  description?: string | null;
  problem?: string | null;
  solution?: string | null;
  impact?: string | null;

  evidence_url?: string | null;

  /**
   * ISO date:
   * 2026-09-16
   */
  occurred_on: string;

  metadata?: JsonObject;
}


export interface ActivityEntryUpdate {
  project_id?: string | null;

  title?: string | null;

  activity_class?: ActivityClass | null;
  activity_type?: ActivityType | null;

  description?: string | null;
  problem?: string | null;
  solution?: string | null;
  impact?: string | null;

  evidence_url?: string | null;

  occurred_on?: string | null;

  metadata?: JsonObject | null;
}


export interface ActivityEntry {
  id: string;

  user_id: string;
  project_id: string | null;

  title: string;

  activity_class: ActivityClass;
  activity_type: ActivityType;

  description: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;

  source: EntrySource;

  evidence_url: string | null;

  /**
   * ISO date:
   * 2026-09-16
   */
  occurred_on: string;

  /**
   * ISO datetime:
   * 2026-09-16T15:30:00Z
   */
  created_at: string;
  updated_at: string;

  edit_locked_at: string | null;

  content_hash: string;

  metadata: JsonObject;
}


// ============================================================
// ACTIVITY EVENT
// ============================================================

export interface ActivityEventCreate {
  project_id?: string | null;

  source: EventSource;

  external_id: string;
  event_type: string;

  activity_class: ActivityClass;
  activity_type: ActivityType;

  /**
   * ISO datetime:
   * 2026-09-16T15:30:00Z
   */
  occurred_at: string;

  payload?: JsonObject;
}


export interface ActivityEvent {
  id: string;

  user_id: string;
  project_id: string | null;

  source: EventSource;

  external_id: string;
  event_type: string;

  activity_class: ActivityClass;
  activity_type: ActivityType;

  occurred_at: string;

  /**
   * Derived by backend from occurred_at.
   */
  occurred_on: string;

  payload: JsonObject;

  ingested_at: string;
}