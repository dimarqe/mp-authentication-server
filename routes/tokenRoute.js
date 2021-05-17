const router = require('express').Router();

const tokenController = require('../controllers/tokenController');
const verifyToken = require('../middleware/verifyToken');

router.post('/logout', verifyToken, tokenController.logout);

router.post('/refresh', verifyToken, tokenController.refreshToken);

module.exports = router;