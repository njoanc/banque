const { User } = require('../models/User');
const _ = require('lodash');


module.exports = class {
    static signup() {
        return async (req, res) => {
            try {
                let user = await User.findOne({ email: req.body.email });
                if (user) return res.status(422).json({ message: 'User already exists' });

                user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'DOB']));
                user.isAdmin = true;
                user.type = 'Staff';
                user.password = await user.hashPassword(user.password);
                user.token = await user.generateAuthToken();

                await user.save();

                res.json({
                    success: 'Admin created successfully',
                    user_id: user._id
                });
            } catch (err) { res.status(400).json({ error: err.message }) }

        }
    }

    static renewToken() {
        return async (req, res) => {
            try {
                let user = await User.validCredentials(req.body.email, req.body.password);
                user.token = await user.generateAuthToken();
                await user.save();

                res.json({ token: user.token });
            } catch (err) { res.status(400).json({ Error: err.message }) }
        }
    }

    static show() {
        return async (req, res) => {
            try {
                let user = await User.find();
                if (!user) return res.status(404).json({ message: 'No users available' });

                res.send(user);
            } catch (ex) { res.status(400).json({ error: err.message }) }
        }
    }

    static index() {
        return async (req, res) => {
            try {
                let user = await User.findById(req.params._id);
                if (!user) return res.status(404).json({ message: 'No users available' });

                res.send(user);
            } catch (ex) { res.status(400).json({ error: err.message }) }
        }
    }

}