const { User } = require('../models/user');
const { Account, validate } = require('../models/account');
const auth = require('../middleware/auth');

// const Joi=require('joi');
const express = require('express');
const router = express.Router();


router.post('/:_id', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findById({ _id: req.params._id })
        if (!user) return res.status(404).send('The user with this ID does not exist');

        let account = await Account.findOne({ NID: req.body.NID });
        if (account) return res.status(400).send('the account is arleady created');
        account = new Account({ NID: req.body.NID });
        account.accountName = user.name;
        account.accountNumber = account.generateAccount();
        await account.save();
        res.send(account);
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }

});


router.get('/', async (req, res) => {
    let accounts = await Account.find().sort('name');
    res.send(accounts);

});
router.get('/:_id', async (req, res) => {
    try {
        let customer = await Account.findById(req.params._id)
        if (!customer) return res.status(400).send('the user with a given ID does not exist');
        res.send(customer);

    }
    catch (ex) {
        res.status(400).send('something went wrong');
    }
});
router.delete('/:_id', async (req, res) => {
    try {
        let acc = await Account.findByIdAndRemove(req.params._id);
        if (!acc) return res.status(400).send('this account id does not exist');

        res.send(acc);
    }

    catch (ex) {
        res.status(400).send('something went wrong');
    }

});
module.exports = router;