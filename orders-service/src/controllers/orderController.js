const OrderModel = require('../models/orderModel');
const axios = require('axios');

// Configuration: Users service base URL (in real deploy use service discovery)
const USERS_BASE = process.env.USERS_BASE || 'http://localhost:3001';

// Small retry helper (synchronously simple)
async function fetchWithRetries(url, opts = {}, retries = 2, backoffMs = 200) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios({ url, ...opts, timeout: 2000 });
    } catch (err) {
      lastErr = err;
      if (i < retries) await new Promise(r => setTimeout(r, backoffMs * (i + 1)));
    }
  }
  throw lastErr;
}

exports.listOrders = (req, res) => {
  res.json(OrderModel.findAll());
};

exports.getOrderById = (req, res) => {
  const order = OrderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

// CREATE Order (inter-service call to Users service to validate user exists)
exports.createOrder = async (req, res) => {
  const { id, userId, items, total } = req.body;
  if (!id || !userId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'id, userId, items required' });
  }

  // Call Users service to fetch user
  try {
    const response = await fetchWithRetries(`${USERS_BASE}/users/${userId}`, { method: 'GET' }, 2, 200);
    if (response.status !== 200) {
      return res.status(502).json({ error: 'Failed to validate user' });
    }
    const user = response.data;
    // Optionally check balance
    if (typeof total === 'number' && user.balance < total) {
      return res.status(400).json({ error: 'Insufficient user balance' });
    }

    // Optionally reduce balance in user service (demo update)
    if (typeof total === 'number') {
      // attempt to update user balance (best effort)
      try {
        await axios.put(`${USERS_BASE}/users/${userId}`, { balance: user.balance - total }, { timeout: 2000 });
      } catch (err) {
        // If balance update fails, we choose to continue but mark order as PENDING_PAYMENT
        console.warn('Failed to update user balance', err.message);
      }
    }

    const order = OrderModel.create({ id, userId, items, total, status: 'CREATED', createdAt: new Date().toISOString() });
    return res.status(201).json(order);
  } catch (err) {
    // Could not reach user service / other error
    console.error('Error communicating with user service:', err.message || err);
    return res.status(503).json({ error: 'User service unavailable', details: err.message });
  }
};
