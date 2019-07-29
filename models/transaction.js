// const express=require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');


const transactionSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ['Deposit', 'Withdrawal']
    },
    accountName: {
        type: String
    },
    accountNumber: {
        type: Number
    },
    transactionName: {
        type: String,
        enum: ['withdraw', 'deposit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    token: { type: String },
    datedIn: { type: Date, default: Date.now() }
});

// generate token
transactionSchema.methods.generateAuthToken = async () => {

    const token = await jwt.sign({ _id: this._id }, config.get('jwtKey'));
    this.token = token;

    return token;
}

// Joi validation
exports.validTransaction = function (req, res, next) {
    const details = req.body;

    const schema = {
        type: Joi.string().valid('Deposit', 'Withdrawal').required(),
        accountName: Joi.string().required(),
        accountNumber: Joi.number().required(),
        amount: Joi.number().required()
    }

    const options = config.get('joiOptions');

    const { error } = Joi.validate(details, schema, options);
    if (error) return res.status(422).json({ error: error.details[0].message });

    next();
}

//model
exports.Transaction = mongoose.model('Transaction', transactionSchema);