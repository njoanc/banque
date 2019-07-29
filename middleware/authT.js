const jwt = require('jsonwebtoken');
const config = require('config');
const { Transaction } = require('../models/Transaction');

module.exports = async function (req, res, next) {
    let token = req.header('Transaction');
    try {
        let decoded = jwt.verify(token, config.get('jwtKey'));
        let transaction = await Transaction.findOne({ token: decoded, 'token': token });
        if (!transaction) throw new Error();

        req.transaction = transaction;
        next();
    } catch (ex) { res.status(400).json({ message: 'Invalid1 Token' }) }

}