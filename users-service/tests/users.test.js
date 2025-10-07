const request = require('supertest');
const app = require('../src/app');
const UserModel = require('../src/models/userModel');

describe('Users API', () => {
  test('GET /users returns array', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /users/:id returns user or 404', async () => {
    const u = UserModel.findAll()[0];
    const res = await request(app).get(`/users/${u.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(u.id);

    const res404 = await request(app).get('/users/notexist');
    expect(res404.statusCode).toBe(404);
  });

  test('POST /users creates user', async () => {
    const payload = { id: 'u-test', name: 'Test User', email: 't@example.com' };
    const res = await request(app).post('/users').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe('u-test');
  });
});
