// module - firebase
const firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');

// module - fs
const fs = require("fs"); 

// module -dotenv
require('dotenv').config()

// create public directory if it does not exist
const PUBLICDIR = "public";
fs.mkdirSync(`./${PUBLICDIR}`, { recursive: true })


//Initialize firebase connection
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.database();


/**
 * Listen for changes in the firebase DB and update JSON files
 * 
 * @param {string} dbPath [firebase DB path to listen for] 
 */
const firebaseListener = (dbPath) => {
    
    db.ref(dbPath).on("value", (snapshot) => {
        const data = snapshot.val();
        
        // Build folder directory if a nested path is spsecified
        (dbPath.split("/").length > 0) ?
            fs.mkdirSync(`./${PUBLICDIR}/${dbPath.substring(0, dbPath.lastIndexOf("/"))}`, { recursive: true }):null;

        // Write data to JSON file
        const writerStream = fs.createWriteStream(`./${PUBLICDIR}/${dbPath}.json`);

        // write data to stream
        (data != null) ? writerStream.write(JSON.stringify(data,"", 4), "UTF8"): null;
    
        // mark end of file
        writerStream.end();
        
        writerStream.on('finish', ()=>{
            console.log(`${dbPath} JSON file was successfully updated.`);
        });
    
        writerStream.on('error', (err) => {
            console.log(err.stack);
        });
    })
}

exports.firebaseListener = firebaseListener;