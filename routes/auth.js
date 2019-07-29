const { User } = require('../models/user')
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const config = require('config');

router.post('/', async (req, res) => {
    const { error } = validatep(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')
    const token = jwt.sing({ _id: user._id }, config.get('jwtPrivateKey'));
    res.send(token);
});


function validatep(p) {
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(3).max(500).required()

    };

    return Joi.validate(p, schema)

}
module.exports = router;

