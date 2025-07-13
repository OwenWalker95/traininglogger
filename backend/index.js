const express = require('express');  // Import the express module
const cors = require('cors');
const app = express();              // Create an Express app
const PORT = 3000;                  // Define the port to listen on

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

  console.log('Received workout data:', sessionData);

  // TODO: Save to database 

  res.status(200).json({ message: 'Workout saved successfully' });
});