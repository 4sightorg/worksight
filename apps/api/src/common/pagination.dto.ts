import { BadRequestException } from '@nestjs/common';

export type PaginationQuery = {
  limit?: number;
  offset?: number;
};

export function parsePaginationParams(
  limitStr?: string,
  offsetStr?: string
): PaginationQuery {
  let limit: number | undefined;
  let offset: number | undefined;

  if (limitStr !== undefined && limitStr !== '') {
    limit = Number(limitStr);
    if (!Number.isInteger(limit) || limit < 0) {
      throw new BadRequestException('limit query parameter must be a non-negative integer');
    }
  }

  if (offsetStr !== undefined && offsetStr !== '') {
    offset = Number(offsetStr);
    if (!Number.isInteger(offset) || offset < 0) {
      throw new BadRequestException('offset query parameter must be a non-negative integer');
    }
  }

  return { limit, offset };
}

export function paginate<T>(items: T[], query?: PaginationQuery): T[] {
  if (!query) return items;
  const offset = query.offset ?? 0;
  if (query.limit !== undefined) {
    return items.slice(offset, offset + query.limit);
  }
  return offset > 0 ? items.slice(offset) : items;
}
