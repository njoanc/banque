const express = require('express');
const error = require('../middlewares/error');
const client = require('../routes/users/client');
const transaction = require('../routes/transaction');
const staff = require('../routes/users/staff');
const morgan = require('morgan');


module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('tiny'));
    app.use('/api/users', client);
    app.use('/api/transactions', transaction);
    app.use('/api/admin', staff);
    app.use(error);
}
