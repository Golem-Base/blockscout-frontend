import { isObject } from 'es-toolkit/compat';

import type { Pagination } from '@golembase/l3-indexer-types';

interface NextPageParams {
  page: number;
  page_size: number;
}

export type PaginatedResponse<T extends { pagination?: Pagination }> = Omit<T, 'pagination'> & { next_page_params: NextPageParams | null };

export function hasGolemBasePagination<T>(response: unknown): response is T & { pagination?: Pagination } {
  return isObject(response) && !('next_page_params' in response) && 'pagination' in response;
}

/**
 * Converts a ListOperationsResponse from @golembase/l3-indexer-types to blockscout pagination format
 * @param response - The response from golembase API with pagination
 * @returns The same response but with pagination converted to next_page_params format
 */
export function convertGolemBasePagination<T extends { pagination?: Pagination }>(response: T): PaginatedResponse<T> {
  const { pagination } = response;

  if (!pagination) {
    return {
      ...response,
      next_page_params: null,
    };
  }

  const currentPage = parseInt(pagination.page, 10);
  const totalPages = parseInt(pagination.total_pages, 10);

  if (currentPage < totalPages) {
    const nextPage = currentPage + 1;
    return {
      ...response,
      next_page_params: {
        page: nextPage,
        page_size: Number(pagination.page_size),
      },
    };
  }

  return {
    ...response,
    next_page_params: null,
  };
}
