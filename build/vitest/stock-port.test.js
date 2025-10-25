var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// test/routes.test.ts
import request from "supertest";
import express from 'express';
import testRoute from '../src/routes/test.js';
import { vi, describe, it, expect } from 'vitest';
vi.mock('../src/utils/supabase', () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        __esModule: true,
        default: {
            from: () => ({
                insert: () => ({
                    select: () => ({
                        data: [{ id: 1, name: 'Mock Position' }],
                        error: null,
                    }),
                }),
                select: () => ({
                    limit: () => ({
                        data: [{ id: 1, name: 'Mock Position' }],
                        error: null,
                    }),
                }),
            }),
        },
    };
}));
const app = express();
app.use(express.json());
app.use('/api', testRoute);
describe('GET /api/test', () => {
    it('should return mock data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app).get('/api/test');
        console.log('Test response:', res.body);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
    }));
    it('should return posted data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request(app)
            .post('/api/test')
            .send({ name: 'Mock name' });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    }));
});
