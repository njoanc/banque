const { Transaction } = require('../models/Transaction');
const { Account } = require('../models/Account');
const _ = require('lodash');
const mongoose = require('mongoose');


module.exports = class {
    static transaction() {
        return async (req, res) => {
            try {
                let account = await Account.findById(req.account._id);
                let transaction = new Transaction(_.pick(req.body, ['type', 'accountName', 'accountNumber', 'amount']));

                if (account.accountName !== transaction.accountName) {
                    throw new Error('Invalid Account');
                }
                else if (account.accountNumber !== transaction.accountNumber) {
                    throw new Error('Invalid Account');
                }

                transaction.token = await transaction.generateAuthToken();
                await transaction.save();

                res.json({
                    success: transaction.type + ' sent successfully',
                    token: transaction.token
                })
            } catch (err) { res.status(400).json({ error: err.message }) }

        }
    }

    static showAll() {
        return async (req, res) => {
            try {
                let transaction = await Transaction.find();
                if (!transaction) return res.status(404).json({ message: 'No transactions available' });

                res.send(transaction);
            } catch (err) { res.status(400).json({ Error: err.message }) }

        }
    }

    static byDate() {
        return async (req, res) => {
            try {
                const Dater = mongoose.model('Date', new mongoose.Schema({
                    start: { type: Date },
                    end: { type: Date }
                }))

                let dater = new Dater(_.pick(req.body, ['start', 'end']));
                let transaction = await Transaction.find({ datedIn: { $gte: dater.start, $lt: dater.end } });
                if (!transaction) return res.status(404).json({ message: 'No transactions available' });

                res.send(transaction);

            } catch (err) { res.status(400).json({ Error: err.message }) }
        }
    }

    static index() {
        return async (req, res) => {
            let transaction = await Transaction.findById(req.transaction._id);

            res.json({
                type: transaction.type,
                account_name: transaction.accountName,
                amount: transaction.amount
            });
        }
    }
}