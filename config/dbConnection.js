const Pool = require('pg').Pool;

//local testing db connection
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.HOST,
//     database: process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port: 5432,
//     ssl:{
//         rejectUnauthorized: false
//     }
// });

//db connection while app is hosted on heroku
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;



