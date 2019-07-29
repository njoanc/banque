const jwt = require('jsonwebtoken');
const config = require('config');
const { Account } = require('../models/Account');

module.exports = async function (req, res, next) {
    let token = req.header('Account-Token');
    try {
        let decoded = jwt.verify(token, config.get('jwtKey'));
        let account = await Account.findOne({ token: decoded, 'token': token });
        if (!account) throw new Error();

        req.account = account;
        next();
    } catch (ex) { res.status(400).json({ message: 'Invalid Token' }) }

}