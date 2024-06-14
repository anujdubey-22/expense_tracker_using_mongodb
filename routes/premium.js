const express = require('express');
const verifyToken = require('../middleware/auth');
const premiumController = require('../controller/premium');
const router = express.Router();

router.get('/showLeaderBoard',verifyToken,premiumController.getshowLeaderBoard);

module.exports = router;