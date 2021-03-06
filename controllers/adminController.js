const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const AdminModel = require('../models/adminModel');
const TokenModel = require('../models/tokenModel');

const adminController = {
    login:
        async (req, res, next) => {
            await body('adminID', 'Invalid ID#, must be integer').isInt().trim().escape().run(req);
            await body('password', 'Invalid password, 30 character limit').isLength({ min: 1 }, { max: 30 }).trim().escape().run(req);

            const reqErrors = validationResult(req);

            if (!reqErrors.isEmpty()) {
                return res.status(400).json({
                    "error": true,
                    "message": reqErrors.array(),
                    "data": null
                });
            }

            AdminModel.findByID(req.body.adminID, (err, doc) => {
                if (err) {
                    return next(err);
                }
                else if (!doc || doc.length <= 0) {
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
                            try {
                                //creating access token
                                var accessToken = jwt.sign({
                                    "role": "admin",
                                    "id": doc.admin_id
                                }, process.env.ACCESS_TOKEN, { expiresIn: "30m" });

                                //generate unique uuid for refresh token
                                var tokenId = uuidv4();

                                //creating refresh token
                                var refreshToken = jwt.sign({
                                    "role": "admin",
                                    "id": doc.admin_id
                                }, process.env.REFRESH_TOKEN, { expiresIn: "1d", jwtid: tokenId });
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
                                else{
                                    return res.status(200).json({
                                        "error": false,
                                        "message": "User successfully logged in",
                                        "data": {
                                            "accessToken": accessToken,
                                            "refreshToken": refreshToken
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
    ,
}


module.exports = adminController;