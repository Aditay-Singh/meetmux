const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/orders', ordersRouter);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'orders' }));

module.exports = app;
