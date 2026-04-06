import { buildResponse } from '../utils/response';

describe('Response Utils', () => {
  describe('buildResponse', () => {
    it('should return response without data', () => {
      const result = buildResponse(true, 'Success');
      expect(result).toEqual({ success: true, message: 'Success' });
    });

    it('should return response with data', () => {
      const result = buildResponse(true, 'Success', { id: 1 });
      expect(result).toEqual({ success: true, message: 'Success', data: { id: 1 } });
    });

    it('should handle false success', () => {
      const result = buildResponse(false, 'Error');
      expect(result).toEqual({ success: false, message: 'Error' });
    });
  });
});