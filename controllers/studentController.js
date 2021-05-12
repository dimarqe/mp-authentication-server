const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const StudentModel = require('../models/studentModel');
const TokenModel = require('../models/tokenModel');

const studentController = {
    login:
        async (req, res, next) => {
            await body('studentID', 'Invalid ID#, must be integer').isInt().trim().escape().run(req);
            await body('password', 'Invalid password, 30 character limit').isLength({ min: 1 }, { max: 30 }).trim().escape().run(req);

            const reqErrors = validationResult(req);

            if (!reqErrors.isEmpty()) {
                return res.status(400).json({
                    "error": true,
                    "message": reqErrors.array(),
                    "data": null
                });
            }

            StudentModel.findByID(req.body.studentID, (err, doc) => {
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
                    bcrypt.compare(req.body.password, doc.accessCode, (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        else if (result == true) {
                            const accessToken = jwt.sign({
                                "role": "student",
                                "id": doc.studentID
                            }, process.env.ACCESS_TOKEN, { expiresIn: "7d" });
                            doc.accessCode = undefined;

                            

                            return res.status(200).json({
                                "error": false,
                                "message": "User successfully logged in",
                                "data": {
                                    "token": accessToken,
                                    "user": doc
                                }
                            })
                        }
                        return res.status(404).json({
                            "error": true,
                            "message": "Incorrect login credentials",
                            "data": null
                        });
                    });
                }
            });
        }
}

module.exports = studentController;