// test/routes.test.ts
import request from "supertest";
import express from 'express';
import testRoute from '../src/routes/test';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../src/utils/supabase', async () => {
  return {
    __esModule: true, // 👈 ensures it mocks an ES module correctly
    default: {
      from: () => ({
        select: () => ({
          limit: () => ({
            data: [{ id: 1, name: 'Mock position' }],
            error: null,
          }),
        }),
      }),
    },
  };
});


const app = express();
app.use('/api', testRoute);

describe('GET /api/test', () => {
  it('should return mock data', async () => {
    const res = await request(app).get('/api/test');
    console.log('Test response:', res.body); 
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

