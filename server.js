//Module imports
const dotenv = require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
const express = require('express');

//Route imports
const studentRoute = require('./routes/studentRoute');
const adminRoute = require('./routes/adminRoute');
const driverRoute = require('./routes/driverRoute');
const tokenRoute = require('./routes/tokenRoute');

//App and port initialization
const app = express();
const port = process.env.PORT || 5000;


//express request body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


//Base connection route
app.get('/', (req, res, next) => {
    return res.status(200).json({
        "error":false,
        "message": "...Welcome",
        "data": null
    });
});

//include imported routes
app.use(studentRoute);
app.use(adminRoute);
app.use(driverRoute);
app.use(tokenRoute);

//middleware that catches and returns an error for all undefined routes
app.use('*', (req, res, next) => {
    return res.status(404).json({
        "error":true,
        "message": "Undefined route",
        "data": null
    });
});

//error handling middleware
app.use((err, req, res, next) => {
    console.log(err);

    if (!res.headersSent) {
        return res.status(err.status || 500).json({
            "error": true,
            "message": err.message,
            "data": null
        });
    }
});

app.listen(port, () => {
    console.log("Just touched down on " + port);
});


