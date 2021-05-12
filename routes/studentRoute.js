const router = require('express').Router();

const studentController = require('../controllers/studentController');

router.post('/student/login',studentController.login);


module.exports = router;