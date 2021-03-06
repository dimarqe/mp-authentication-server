const pool = require('../config/dbConnection');

class Admin {
    static findByID(adminID, result){
        pool.query("select * from administrator where admin_id = $1 limit 1", [adminID], (err, doc)=>{
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc.rows[0]);
            }
        });
    }
}


module.exports = Admin;