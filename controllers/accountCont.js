const { Account } = require('../models/Account');
const { User } = require('../models/User');
const _ = require('lodash');

module.exports = class {
    static create() {
        return async (req, res) => {
            try {
                let account = await Account.findOne({ ID: req.body.ID });
                if (account) res.status(422).json({ message: 'Account is owned' });

                account = new Account(_.pick(req.body, ['ID']));
                let user = await User.findById(req.user._id);
                account.accountName = await account.setAccountName(user._id, account.accountName);
                account.accountNumber = await account.setAccountNumber();
                account.token = await account.generateAuthToken();
                await account.save();

                res.json({
                    success: 'Account Created Successfully',
                    accountName: account.accountName,
                    accountNumber: account.accountNumber,
                    balance: account.balance,
                    type: account.type,
                    Account_Token: account.token
                });
            } catch (ex) { res.status(400).json({ message: ex.message }) }
        }
    }
}

