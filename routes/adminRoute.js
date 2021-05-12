const router = require('express').Router();

const adminController = require('../controllers/adminController');
const verifyToken = require('../accessControl/verifyToken');

router.post('/admin/login', adminController.login);

router.delete('/admin/logout', verifyToken, adminController.logout);

module.exports = router;