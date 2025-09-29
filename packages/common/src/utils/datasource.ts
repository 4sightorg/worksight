import { DataSources } from '@worksight/common/data';
import {
  DataSource,
  DataSourceSchema,
  DataSourceStats,
  DataSourceTypes,
  DataSourceTypesSchema
} from '@worksight/common/types';
import { BaseLookup } from './base';

/**
 * SourceLookup
 * ------------
 * Thin wrapper around BaseLookup specialized for DataSource objects.
 * Provides filtering, statistics, and utility methods for data sources.
 */
export class SourceLookup extends BaseLookup<typeof DataSourceSchema> {
  /**
   * Creates a new SourceLookup instance.
   * @param entries - Optional array of DataSource objects; defaults to imported `DataSources`.
   */
  constructor(entries: DataSource[] = DataSources) {
    super(DataSourceSchema, entries);
  }

  /**
   * Computes aggregated statistics for all data sources in the lookup.
   * @returns An object containing:
   * - totalSources: Total number of sources
   * - activeSources: Number of active sources
   * - inactiveSources: Number of inactive sources
   * - typeBreakdown: Count of each data source type
   * - moduleBreakdown: Count of each module used across all sources
   * - integrationCoverage: Percentage of active sources
   */
  public getStats(): DataSourceStats {
    const activeSources = this.entries.filter((s) => s.is_active);

    // Initialize type breakdown with zero counts
    const typeBreakdown: Record<DataSourceTypes, number> = Object.fromEntries(
      DataSourceTypesSchema.options.map((t) => [t, 0])
    ) as Record<DataSourceTypes, number>;

    // Count occurrences for each type
    this.entries.forEach((source) => {
      source.type.forEach((t) => {
        typeBreakdown[t] += 1;
      });
    });

    // Count occurrences for each module
    const moduleBreakdown = this.entries.reduce((acc, source) => {
      source.modules.forEach((mod) => {
        acc[mod] = (acc[mod] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const total = this.entries.length;
    const active = activeSources.length;

    return {
      totalSources: total,
      activeSources: active,
      inactiveSources: total - active,
      typeBreakdown,
      moduleBreakdown,
      integrationCoverage: (active / total) * 100,
    };
  }
}
