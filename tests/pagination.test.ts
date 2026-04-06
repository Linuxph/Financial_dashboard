import { parsePagination } from '../utils/pagination';

describe('Pagination Utils', () => {
  describe('parsePagination', () => {
    it('should parse valid page and limit', () => {
      const result = parsePagination('2', '20');
      expect(result.pageNumber).toBe(2);
      expect(result.limitNumber).toBe(20);
      expect(result.skip).toBe(20);
    });

    it('should default to page 1 and limit 10 for invalid input', () => {
      const result = parsePagination('invalid', 'invalid');
      expect(result.pageNumber).toBe(1);
      expect(result.limitNumber).toBe(10);
    });

    it('should clamp limit to max 100', () => {
      const result = parsePagination('1', '200');
      expect(result.limitNumber).toBe(100);
    });

    it('should handle undefined values', () => {
      const result = parsePagination(undefined, undefined);
      expect(result.pageNumber).toBe(1);
      expect(result.limitNumber).toBe(10);
    });

    it('should not allow page less than 1', () => {
      const result = parsePagination('0', '10');
      expect(result.pageNumber).toBe(1);
    });

    it('should not allow limit less than 1', () => {
      const result = parsePagination('1', '0');
      expect(result.limitNumber).toBe(1);
    });
  });
});