const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

router.get('/', controller.listOrders);
router.get('/:id', controller.getOrderById);
router.post('/', controller.createOrder);

module.exports = router;
