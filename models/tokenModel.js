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

    static findByID(studentID, result){
        pool.query("select * from student where student_id = ? limit 1", studentID, (err, doc)=>{
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc[0]);
            }
        });
    }

    static delete(driverID, result){
        pool.query("delete from driver where driver_id = ? limit 1", driverID, (err, doc) => {
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