const pool = require('../config/dbConnection');

class Student {
    static findByID(studentID, result){
        pool.query("select * from student where student_id = $1", [studentID], (err, doc)=>{
            if (err) {
                result(err, null);
            }
            else {
                result(null, doc.rows[0]);
            }
        });
    }
}

module.exports = Student;