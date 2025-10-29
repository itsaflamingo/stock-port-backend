"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// test/routes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const test_js_1 = __importDefault(require("../src/routes/test.js"));
const vitest_1 = require("vitest");
vitest_1.vi.mock('../src/utils/supabase', () => __awaiter(void 0, void 0, void 0, function* () {
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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', test_js_1.default);
(0, vitest_1.describe)('GET /api/test', () => {
    (0, vitest_1.it)('should return mock data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/test');
        console.log('Test response:', res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data).toHaveLength(1);
    }));
    (0, vitest_1.it)('should return posted data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/api/test')
            .send({ name: 'Mock name' });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(res.body.success).toBe(true);
    }));
});
