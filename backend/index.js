const express = require('express');  // Import the express module
const cors = require('cors');
const app = express();              // Create an Express app
const PORT = 3000;                  // Define the port to listen on

// Opens connection to sqlite database - if file doesn't exist, create it
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tracker.db');

// This creates table if it doesnt exist. currently each session is just text field
db.run(`
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT
);
`); 

db.run(`
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER,
  name TEXT,
  FOREIGN KEY(session_id) REFERENCES workout_sessions(id)
);
`); 

db.run(`
CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER,
  weight INTEGER,
  reps INTEGER,
  FOREIGN KEY(exercise_id) REFERENCES exercises(id)
);
`); 

// Database functions
async function save_wkout(db,sessionData){
    // insert session high level data and get session ID
    const sessionID = await insertSession(db,sessionData.date);
    console.log(`SeshID:${sessionID}`);
    
    // insert each exercise using the sessionID
    for (let i = 0; i < (sessionData.exercises.length); i++)
    {
        const exerciseID = await insertExercise(db, sessionID, sessionData.exercises[i].exercise);
        console.log(`exID:${exerciseID}`);
        // insert each set for this exercise using the exerciseID
        for (let i2 = 0; i2 < sessionData.exercises[i].sets.length; i2++){
            const weight = sessionData.exercises[i].sets[i2].weight;
            const reps = sessionData.exercises[i].sets[i2].reps;
            const setID = await insertSet(db, exerciseID, weight, reps);
            console.log(`setID:${setID}`);
        }
    }
    
}

async function insertSession(db, date){    
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO sessions (date) VALUES (?)`, [date], function (err) {
            if (err) return reject(err);
            resolve(this.lastID); // 'this' contains metadata like lastID
        });
    });    
}

async function insertExercise(db, sessionID, name){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO exercises (session_id, name) VALUES (?, ?)`, [sessionID, name], function (err){
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

async function insertSet(db, exerciseID, weight, reps){
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO sets (exercise_id, weight, reps) VALUES (?, ?, ?)`, [exerciseID, weight, reps],
        function (err){
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

// Middleware to parse incoming JSON
// automatically parse any JSON sent in the body of POST/PUT requests, and make it available on req.body.
app.use(express.json());

app.use(cors()); // allow all origins (in production would restrict to actual frontend domain)

// Basic route to test server
app.get('/ping', (req, res) => {
    res.send('pong');  // Respond with 'pong' when /ping is requested
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


// Route to recieve saved session data
app.post('/save_session', (req, res) => {
    const sessionData = req.body; // This will contain the sent JSON
//    const sessionString = JSON.stringify(sessionData);  // stringifying for now to store as one text field

    console.log('Received workout data:', sessionData);

    // Save to database 
    save_wkout(db,sessionData);
});


// close DB on exit
process.on('SIGINT', () => {
  db.close();
  process.exit();
});