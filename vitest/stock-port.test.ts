// test/routes.test.ts
// import request from "supertest";
// import express from 'express';
// import testRoute from '../src/routes/test.js';
// import { vi, describe, it, expect } from 'vitest';

// vi.mock('../src/utils/supabase', async () => {
//   return {
//     __esModule: true,
//     default: {
//       from: () => ({
//         insert: () => ({
//           select: () => ({
//             data: [{ id: 1, name: 'Mock Position' }],
//             error: null,
//           }),
//         }),
//         select: () => ({
//           limit: () => ({
//             data: [{ id: 1, name: 'Mock Position' }],
//             error: null,
//           }),
//         }),
//       }),
//     },
//   };
// });


// const app = express();
// app.use(express.json());
// app.use('/api', testRoute);

// describe('GET /api/test', () => {
//   it('should return mock data', async () => {
//     const res = await request(app).get('/api/test');
//     console.log('Test response:', res.body);
//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data).toHaveLength(1);
//   });
//   it('should return posted data', async () => {
//     const res = await request(app)
//       .post('/api/test')
//       .send({ name: 'Mock name' });

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);

//   })
// });

