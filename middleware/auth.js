const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User');


module.exports = async function (req, res, next) {
    let token = req.header('x-auth-token');
    try {
        let decoded = jwt.verify(token, config.get('jwtKey'));
        let user = await User.findOne({ token: decoded, 'token': token });
        if (!user) throw new Error();

        req.user = user;
        next();
    } catch (ex) { res.status(401).json({ message: 'Invalid1 Token' }) }



}
