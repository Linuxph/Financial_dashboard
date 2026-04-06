"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
describe('Response Utils', () => {
    describe('buildResponse', () => {
        it('should return response without data', () => {
            const result = (0, response_1.buildResponse)(true, 'Success');
            expect(result).toEqual({ success: true, message: 'Success' });
        });
        it('should return response with data', () => {
            const result = (0, response_1.buildResponse)(true, 'Success', { id: 1 });
            expect(result).toEqual({ success: true, message: 'Success', data: { id: 1 } });
        });
        it('should handle false success', () => {
            const result = (0, response_1.buildResponse)(false, 'Error');
            expect(result).toEqual({ success: false, message: 'Error' });
        });
    });
});
