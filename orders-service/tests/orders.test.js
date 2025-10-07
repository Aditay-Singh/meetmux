const request = require('supertest');
const app = require('../src/app');
const OrderModel = require('../src/models/orderModel');
const axios = require('axios');

jest.mock('axios');

describe('Orders API', () => {
  beforeEach(() => {
    // reset in-memory orders
    OrderModel.findAll().length = 0;
  });

  test('POST /orders returns 201 when user exists', async () => {
    // mock users service response
    axios.mockImplementation(({ url }) => {
      if (url.endsWith('/users/u1')) {
        return Promise.resolve({ status: 200, data: { id: 'u1', name: 'Alice', balance: 100 } });
      }
      if (url.includes('/users/')) {
        return Promise.resolve({ status: 404 });
      }
      return Promise.reject(new Error('unknown'));
    });

    const payload = { id: 'o1', userId: 'u1', items: [{ product: 'p1', qty: 1 }], total: 10 };
    const res = await request(app).post('/orders').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe('o1');
  });

  test('POST /orders returns 400 for insufficient balance', async () => {
    axios.mockResolvedValue({ status: 200, data: { id: 'u2', name: 'Bob', balance: 5 }});
    const payload = { id: 'o2', userId: 'u2', items: [{ product: 'p2', qty: 1 }], total: 20 };
    const res = await request(app).post('/orders').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Insufficient/);
  });

  test('POST /orders returns 503 when user service down', async () => {
    axios.mockRejectedValue(new Error('connect ECONNREFUSED'));
    const payload = { id: 'o3', userId: 'u3', items: [{ product: 'p3', qty: 1 }], total: 10 };
    const res = await request(app).post('/orders').send(payload);
    expect(res.statusCode).toBe(503);
  });
});
