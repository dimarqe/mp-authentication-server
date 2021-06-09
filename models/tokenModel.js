const pool = require('../config/dbConnection');

class Token {
    constructor(token) {
        this.jti = token.jti;
        this.iat = token.iat;
        this.exp = token.exp;
    }

    static save(token, result){
        pool.query("insert into refresh_token (jti, iat, expiration) values ($1, $2, $3)", [token.jti, token.iat, token.exp], (err, doc) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc);
            }
        });
    }

    static findById(jti, result){
        pool.query("select * from refresh_token where jti = $1", [jti], (err, doc) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc.rows[0]);
            }
        });
    }

    static delete(jti, result){
        pool.query("delete from refresh_token where jti = $1", [jti], (err, doc) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc);
            }
        });
    }
}

module.exports = Token;