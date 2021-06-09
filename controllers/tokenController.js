const jwt = require('jsonwebtoken');

const TokenModel = require('../models/tokenModel');

const tokenController = {
    logout:
        async(req, res, next)=>{
            TokenModel.delete(req.user.jti, (err, doc)=>{
                if(err){
                    return next(err);
                }
                else if (doc.rowCount >= 1) {
                    return res.status(200).json({
                        "error": false,
                        "message": "User successfully logged out",
                        "data": null
                    });
                }
                else {
                    return res.status(500).json({
                        "error": true,
                        "message": "Error removing token",
                        "data": null
                    });
                }
            });
        }
    ,
    refreshToken:
        async(req, res , next)=>{
            TokenModel.findById(req.user.jti, (err, doc)=>{
                if(err){
                    return next(err);
                }
                else if(!doc || doc.length == 0){
                    return res.status(404).json({
                        "error":true,
                        "message": "Invalid refresh token",
                        "data": null
                    });
                }
                else{
                    try {
                        //creating access token
                        var accessToken = jwt.sign({
                            "role": req.user.role,
                            "id": req.user.id
                        }, process.env.ACCESS_TOKEN, { expiresIn: "30m" });
                    } catch (error) {
                        return next(error);
                    }

                    return res.status(200).json({
                        "error":false,
                        "message": "Token successfully verified",
                        "data": {
                            "accessToken":accessToken
                        }
                    })
                }
            });
        }
}


module.exports = tokenController;