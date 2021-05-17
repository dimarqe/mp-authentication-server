const router = require('express').Router();

const adminController = require('../controllers/adminController');

router.post('/admin/login', adminController.login);

module.exports = router;