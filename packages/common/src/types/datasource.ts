import { z } from 'zod';

/**
 * Enum-like schema for allowed data source types.
 */
export const DataSourceTypesSchema = z.enum([
  'task_management',
  'project_management',
  'vcs',
  'erp',
  'communication',
  'collaboration',
]);

/**
 * Zod schema representing a single data source.
 */
export const DataSourceSchema = z.object({
  /** Unique identifier for the data source */
  id: z.uuid(),

  /** Name of the data source */
  name: z.string(),

  /** Type(s) of the data source */
  type: z.array(DataSourceTypesSchema),

  /** Base URL for the data source API or service */
  base_url: z.url(),

  /** Indicates whether the data source is active */
  is_active: z.boolean(),

  /** List of modules/features provided by the data source */
  modules: z.array(z.string()),

  /** Timestamp when the source was created */
  created_at: z.date(),

  /** Timestamp when the source was last updated */
  updated_at: z.date(),
});

/**
 * Zod schema for aggregated statistics across data sources.
 */
export const DataSourceStatsSchema = z.object({
  /** Total number of data sources */
  totalSources: z.number(),

  /** Number of active data sources */
  activeSources: z.number(),

  /** Number of inactive data sources */
  inactiveSources: z.number(),

  /** Count of each data source type */
  typeBreakdown: z.record(DataSourceTypesSchema, z.number()),

  /** Count of each module used across all sources */
  moduleBreakdown: z.record(z.string(), z.number()),

  /** Percentage of active sources relative to total */
  integrationCoverage: z.number(),
});

// Type inference
export type DataSourceTypes = z.infer<typeof DataSourceTypesSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type DataSourceStats = z.infer<typeof DataSourceStatsSchema>;
