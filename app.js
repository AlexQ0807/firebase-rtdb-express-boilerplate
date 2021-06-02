// module - express
const express = require("express")

// module - express rate-limit
const rateLimit = require("express-rate-limit");

// module - express basic-auth
const basicAuth = require('express-basic-auth')

// module - compression
const compression = require("compression");

// module - fs
const fs = require("fs"); 

// module - morgan
const morgan = require("morgan");

// module -dotenv
require('dotenv').config()

// local module - firebase listener
const { firebaseListener } = require('./firebaseapp');


// Express configurations
const app = express();
app.use(compression()); // apply compression


app.use(basicAuth({                     // apply basic auth
    users: { [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD },
    challenge: true
}));

// rate-limiter rule
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20 // limit each IP to 20 requests per windowMs
});
app.use(limiter);   //apply to all requests

//enable request logging format
app.use(morgan("tiny"));     


// Default PORT number for server
const PORT = process.env.PORT || 5000; 

const PUBLICDIR = "public";

// When the application starts up, fetch the data from Firebase and save them to JSON files in the public folder 
// Afterwards, listen for changes in the Firebase DB and update the JSON files
//firebaseListener("db_path")
//firebaseListener("parent/db_path");


// APIs
app.get('/ping', (req, res) => {
    console.log("OK");
    res.send('OK');
});


// Create API routes to read JSON data saved in the public folder...


const server = app.listen(PORT, () => {
    let host = server.address().address
    let port = server.address().port
    
    console.log("App listening at http://%s:%s", host, port)
 })
