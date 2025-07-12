const express = require('express');  // Import the express module
const app = express();              // Create an Express app
const PORT = 3000;                  // Define the port to listen on

// Basic route to test server
app.get('/ping', (req, res) => {
  res.send('pong');  // Respond with 'pong' when /ping is requested
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});