// Simple in-memory model for demo
const users = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', balance: 100 },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', balance: 50 }
];

const findAll = () => users;

const findById = (id) => users.find(u => u.id === id);

const create = (user) => {
  users.push(user);
  return user;
};

const update = (id, data) => {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  return users[idx];
};

module.exports = { findAll, findById, create, update };
