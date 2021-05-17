const pool = require('../config/dbConnection');

class Token {
    constructor(token) {
        this.jti = token.jti;
        this.iat = token.iat;
        this.exp = token.exp;
    }

    save(result){
        pool.query("insert into token values (unhex(?),?,?)", [this.jti, this.iat, this.exp], (err, doc) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc);
            }
        });
    }

    static findById(jti, result){
        pool.query("select * from token where jti = unhex(?) limit 1", jti, (err, doc) => {
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc);
            }
        });
    }

    static delete(jti, result){
        pool.query("delete from token where jti = unhex(?) limit 1", jti, (err, doc) => {
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