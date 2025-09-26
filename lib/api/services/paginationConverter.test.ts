import { convertGolemBasePagination, hasGolemBasePagination } from './paginationConverter';

describe('paginationConverter', () => {
  describe('hasGolemBasePagination', () => {
    it('should return true for response with pagination but no next_page_params', () => {
      const mockResponse = {
        items: [ { id: 1 } ],
        pagination: {
          page: '1',
          page_size: '10',
          total_pages: '3',
          total_items: '25',
        },
      };

      expect(hasGolemBasePagination(mockResponse)).toBe(true);
    });

    it('should return false for response with next_page_params', () => {
      const mockResponse = {
        items: [ { id: 1 } ],
        next_page_params: {
          page: 2,
        },
      };

      expect(hasGolemBasePagination(mockResponse)).toBe(false);
    });

    it('should return false for non-object response', () => {
      expect(hasGolemBasePagination(null)).toBe(false);
      expect(hasGolemBasePagination(undefined)).toBe(false);
      expect(hasGolemBasePagination('string')).toBe(false);
    });
  });

  describe('convertGolemBasePagination', () => {
    it('should convert pagination with next page', () => {
      const mockResponse = {
        items: [ { id: 1 }, { id: 2 } ],
        pagination: {
          page: '1',
          page_size: '10',
          total_pages: '3',
          total_items: '25',
        },
      };

      const result = convertGolemBasePagination(mockResponse);

      expect(result).toEqual({
        ...mockResponse,
        next_page_params: {
          page: 2,
          page_size: 10,
        },
      });
    });

    it('should return null next_page_params when on last page', () => {
      const mockResponse = {
        items: [ { id: 1 }, { id: 2 } ],
        pagination: {
          page: '3',
          page_size: '10',
          total_pages: '3',
          total_items: '25',
        },
      };

      const result = convertGolemBasePagination(mockResponse);

      expect(result).toEqual({
        ...mockResponse,
        next_page_params: null,
      });
    });
  });
});
