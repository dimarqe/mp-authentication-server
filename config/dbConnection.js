const Pool = require('pg').Pool;

//local testing db connection
const pool = new Pool({
    user: 'durrdyuvjgivpw',
    host: 'ec2-3-233-7-12.compute-1.amazonaws.com',
    database: 'df6k95m815ln3d',
    password: 'd8bd636878a2a404b668f84ea3052fbbe27f83330d672e19dff33aa5077d919d',
    port: 5432,
    ssl:{
        rejectUnauthorized: false
    }

});

//db connection while app is hosted on heroku
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

module.exports = pool;



