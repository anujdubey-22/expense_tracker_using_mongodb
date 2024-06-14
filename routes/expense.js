const express = require('express');
const controller = require('../controller/expense');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/get-expense', verifyToken, controller.getExpense);

router.post('/signup',controller.postUser);

router.post('/validate',controller.postValidate);

router.post('/post-expense',controller.postExpense);

router.post('/premium', verifyToken, controller.postPremium);

router.post('/updatetransactions',verifyToken,controller.postUpdatetransactions);

router.post('/failedTransaction', verifyToken, controller.postFailedTransaction);

router.delete('/delete-expense/:id',controller.deleteExpense);

router.get('/download', verifyToken, controller.getDownload);

router.get('/downloadedfiles', verifyToken, controller.getDownloadedFiles);


module.exports = router;