const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const DriverModel = require('../models/driverModel');
const TokenModel = require('../models/tokenModel');

const driverController = {
    login:
        async (req, res, next) => {
            //validating fields sent in request body
            await body('driverID', 'Invalid ID#, must be integer').isInt().trim().escape().run(req);
            await body('password', 'Invalid password, 30 character limit').isLength({ min: 1 }, { max: 30 }).trim().escape().run(req);

            const reqErrors = validationResult(req);

            if (!reqErrors.isEmpty()) {
                return res.status(400).json({
                    "error": true,
                    "message": reqErrors.array(),
                    "data": null
                });
            }

            DriverModel.findByID(req.body.driverID, (err, doc) => {
                if (err) {
                    return next(err);
                }
                else if (!doc || doc.length == 0) {
                    return res.status(404).json({
                        "error": true,
                        "message": "Incorrect login credentials",
                        "data": null
                    });
                }
                else {
                    bcrypt.compare(req.body.password, doc.access_code, (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        else if (result == true) {
                            var driver = doc;
                        
                            try {
                                //creating access token
                                var accessToken = jwt.sign({
                                    "role": "driver",
                                    "id": doc.driver_id
                                }, process.env.ACCESS_TOKEN, { expiresIn: "30m" });

                                //generate unique uuid for refresh token
                                let tokenId = uuidv4();

                                //creating refresh token
                                var refreshToken = jwt.sign({
                                    "role": "driver",
                                    "id": doc.driver_id
                                }, process.env.REFRESH_TOKEN, { expiresIn: "7d", jwtid: tokenId });
                            } catch (error) {
                                return next(error);
                            }

                            const decodedToken = jwt.decode(refreshToken);

                            //creating object based on refresh token
                            const newToken = new TokenModel({
                                jti: decodedToken.jti,
                                iat: decodedToken.iat,
                                exp: decodedToken.exp
                            });

                            //saving token object to database
                            TokenModel.save(newToken, (err, doc) => {
                                if (err) {
                                    return next(err);
                                }
                                else {
                                    //removing password from retrieved driver object
                                    driver.access_code = undefined;

                                    return res.status(200).json({
                                        "error": false,
                                        "message": "User successfully logged in",
                                        "data": {
                                            "accessToken": accessToken,
                                            "refreshToken": refreshToken,
                                            "user": driver
                                        }
                                    })
                                }
                            });
                        }
                        else {
                            return res.status(404).json({
                                "error": true,
                                "message": "Incorrect login credentials",
                                "data": null
                            });
                        }
                    });
                }
            });
        }
}

module.exports = driverController;