const { User } = require('../models/User');
const _ = require('lodash');
const { Transaction } = require('../models/Transaction');
const { Account } = require('../models/Account');

module.exports = class {
    static signup() {
        return async (req, res) => {
            try {
                let user = await User.findOne({ email: req.body.email });
                if (user) return res.status(422).json({ message: 'User already exists' });

                user = new User(_.pick(req.body, ['name', 'email', 'password', 'DOB', 'position']));
                user.type = 'Staff';
                user.password = await user.hashPassword(user.password);
                user.token = await user.generateAuthToken();


                await user.save();

                res.json({
                    success: user.type + ' created successfully',
                    id: user._id
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

    static showAccounts() {
        return async (req, res) => {
            try {
                let account = await Account.find();
                if (!account) return res.status(422).json({ Error: 'Account does not exist' });

                res.json(account);
            } catch (err) { res.status(400).json({ Error: err.message }) }
        }
    }

    static indexAccount() {
        return async (req, res) => {
            try {
                let account = await Account.findOne(req.account._id).populate('transactions');
                if (!account) return res.status(422).json({ Error: 'Account does not exist' });

                res.json(account);
            } catch (err) { res.status(400).json({ Error: err.message }) }
        }
    }

    static credit() {
        return async (req, res) => {

            let account = await Account.findOne(req.account._id);
            if (!account) return res.status(404).json({ Error: 'Account Not found' });

            let transaction = await Transaction.findById(req.transaction._id);
            if (transaction.type !== 'Deposit') return res.status(401).json({ Alert: 'Not allowed' });


            account.balance = parseFloat(account.balance) + parseFloat(transaction.amount);
            account.status = 'Active';
            await account.save();

            res.json({
                success: 'Account credited successfully',
                balance: account.balance
            })

        }
    }

    static debit() {
        return async (req, res) => {

            let account = await Account.findOne(req.account._id);
            if (!account) return res.status(404).json({ Error: 'Account Not found' });

            let transaction = await Transaction.findById(req.transaction._id);
            if (transaction.type !== 'Withdraw') return res.status(401).json({ Alert: 'Not allowed' });


            account.balance = parseFloat(account.balance) - parseFloat(transaction.amount);
            await account.save();


            res.json({
                success: 'Account credited successfully',
                balance: account.balance
            })
        }
    }

    static deactivate() {
        return async (req, res) => {
            let account = await Account.findByIdAndDelete(req.account._id);
            if (!account) return res.status(404).json({ Error: 'Account Not found' });

            await account.save();

            res.json({
                Success: 'Account Deactivated successfully',
                Account_Number: account.accountNumber
            })
        }
    }
}