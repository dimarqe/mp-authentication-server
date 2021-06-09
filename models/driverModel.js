const pool = require('../config/dbConnection');

class Driver {
    static findByID(driverID, result){
        pool.query("select * from driver where driver_id = $1", [driverID], (err, doc)=>{
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc.rows[0]);
            }
        });
    }
}

module.exports = Driver;