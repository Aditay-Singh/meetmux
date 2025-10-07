const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const usersRouter = require('./routes/users');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/users', usersRouter);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'users' }));

module.exports = app;
