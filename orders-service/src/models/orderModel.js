// simple in-memory orders store
const orders = [];

const findAll = () => orders;

const findById = (id) => orders.find(o => o.id === id);

const create = (order) => {
  orders.push(order);
  return order;
};

module.exports = { findAll, findById, create };
