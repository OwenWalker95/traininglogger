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
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`); 


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
    const sessionString = JSON.stringify(sessionData);  // stringifying for now to store as one text field

    console.log('Received workout data:', sessionData);

    // TODO: Save to database 
    db.run(
      'INSERT INTO sessions (data) VALUES (?)',
      [sessionString],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving session');
        } else {
          res.status(200).send({ id: this.lastID });
        }
      }
    ); 

    //res.status(200).json({ message: 'Workout saved successfully' });
});


// close DB on exit
process.on('SIGINT', () => {
  db.close();
  process.exit();
});