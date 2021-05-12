const router = require('express').Router();

const driverController = require('../controllers/driverController');


router.post('/driver/login',driverController.login);


module.exports = router;