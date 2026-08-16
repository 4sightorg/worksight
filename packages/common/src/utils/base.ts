// base.ts
import { z, ZodObject } from 'zod';

export type StatsConfig<T> = {
  numericFields?: (keyof T)[];
  booleanFields?: (keyof T)[];
  categoricalFields?: (keyof T)[];
  arrayFields?: (keyof T)[];
};

/**
 * BaseLookup
 * -------------
 * Generic in-memory lookup class for Zod schemas.
 * Supports filtering, chaining, counting, and extensible statistics.
 */
export class BaseLookup<T extends ZodObject<any>> {
  protected schema: T;
  protected entries: z.infer<T>[];

  constructor(schema: T, entries: z.infer<T>[]) {
    this.schema = schema;
    this.entries = entries;
  }

  /**
   * Filters entries based on given criteria.
   * Supports value equality, "__has_value__", functions, and date ranges.
   */
  filter(params: Partial<Record<keyof z.infer<T>, any>>): this {
    const filtered = this.entries.filter(entry =>
      Object.entries(params).every(([key, value]) => {
        const entryValue = entry[key as keyof z.infer<T>];

        // Function predicate
        if (typeof value === 'function') {
          return value(entryValue);
        }

        // "__has_value__" filter
        if (value === '__has_value__') {
          return entryValue !== null && entryValue !== undefined;
        }

        // Date range filter
        if (entryValue instanceof Date && value && typeof value === 'object') {
          const { from, to, is } = value as { from?: Date; to?: Date; is?: Date };
          if (from && entryValue < from) return false;
          if (to && entryValue > to) return false;
          if (is && entryValue.getTime() !== is.getTime()) return false;
          return true;
        }

        // Fallback: strict equality
        return entryValue === value;
      })
    );

    // Clone via the prototype instead of the constructor: subclasses take
    // (entries) rather than (schema, entries), so `new Cls(schema, filtered)`
    // would silently pass the schema in as the entry list.
    const clone = Object.create(Object.getPrototypeOf(this) as object) as this;
    clone.schema = this.schema;
    clone.entries = filtered;
    return clone;
  }

  /** Returns all entries */
  all(): z.infer<T>[] {
    return this.entries;
  }

  /** Returns the number of entries */
  count(): number {
    return this.entries.length;
  }

  /** Returns the first entry or null */
  first(): z.infer<T> | null {
    return this.entries[0] ?? null;
  }

  /** Appends an entry to the lookup */
  add(entry: z.infer<T>): void {
    this.entries.push(entry);
  }

  /**
   * Compute statistics dynamically based on a stats configuration
   */
  computeStats(config: StatsConfig<z.infer<T>> = {}) {
    const {
      numericFields = [],
      booleanFields = [],
      categoricalFields = [],
      arrayFields = [],
    } = config;
    const stats: any = { total: this.count() };

    // Numeric fields: min, max, average
    numericFields.forEach(field => {
      const values = this.entries
        .map(e => e[field] as unknown as number)
        .filter(v => typeof v === 'number');
      if (values.length) {
        stats[field] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
        };
      } else {
        stats[field] = null;
      }
    });

    // Boolean fields: count of true/false
    booleanFields.forEach(field => {
      const trues = this.entries.filter(e => e[field] === true).length;
      const falses = this.entries.filter(e => e[field] === false).length;
      stats[field] = { true: trues, false: falses };
    });

    // Categorical fields: count per category
    categoricalFields.forEach(field => {
      const breakdown: Record<string, number> = {};
      this.entries.forEach(e => {
        const val = e[field] as unknown as string;
        if (val !== undefined && val !== null) {
          breakdown[val] = (breakdown[val] || 0) + 1;
        }
      });
      stats[field] = breakdown;
    });

    // Array fields: counts of array lengths and average length
    arrayFields.forEach(field => {
      const lengths = this.entries
        .map(e => (Array.isArray(e[field]) ? (e[field] as unknown[]).length : 0))
        .filter(len => len !== undefined);
      stats[field] = {
        min: lengths.length ? Math.min(...lengths) : 0,
        max: lengths.length ? Math.max(...lengths) : 0,
        avg: lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0,
      };
    });

    return stats;
  }
}
