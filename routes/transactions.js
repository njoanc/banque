const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authT');
const acc = require('../middlewares/authAcc');
const { validTransaction } = require('../models/Transaction');
const TransactionController = require('../controllers/transactionCont');

router.post('/account/me', acc, validTransaction, TransactionController.transaction())
router.get('/', auth, TransactionController.showAll())
router.get('/date', auth, TransactionController.byDate())
router.get('/me', auth, TransactionController.index())


module.exports = router;