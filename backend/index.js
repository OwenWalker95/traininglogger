import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();              // Create an Express app
const PORT = 3000;                  // Define the port to listen on

let db;

// Set up database connection and ensure tables exist
async function setupDatabase() {
  db = await open({
    filename: './workouts.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      name TEXT,
      FOREIGN KEY(session_id) REFERENCES sessions(id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER,
      weight INTEGER,
      reps INTEGER,
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    );
  `);

  return db;
}

// Middleware
app.use(express.json()); // automatically parse all incoming JSON
app.use(cors()); // in production this would be restricted to the actual frontend only

// Routes
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/save_session', async (req, res) => {
  const sessionData = req.body;
  try {
    await saveWorkout(db, sessionData);
    res.status(200).send('Session saved');
  } catch (err) {
    console.error('Failed to save session:', err);
    res.status(500).send('Error saving session');
  }
});

app.get('/get_sessions', async (req, res) => {
  try {
    const sessions = await db.all('SELECT * FROM sessions');
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Data saving logic
async function saveWorkout(db, sessionData) {
  const { date, exercises } = sessionData;

  const result = await db.run(`INSERT INTO sessions (date) VALUES (?)`, [date]);
  const sessionID = result.lastID;
  console.log(`Saved session ID: ${sessionID}`);

  for (const exercise of exercises) {
    const exerciseResult = await db.run(
      `INSERT INTO exercises (session_id, name) VALUES (?, ?)`,
      [sessionID, exercise.exercise]
    );
    const exerciseID = exerciseResult.lastID;
    console.log(`  Saved exercise ID: ${exerciseID}`);

    for (const set of exercise.sets) {
      const setResult = await db.run(
        `INSERT INTO sets (exercise_id, weight, reps) VALUES (?, ?, ?)`,
        [exerciseID, set.weight, set.reps]
      );
      console.log(`    Saved set ID: ${setResult.lastID}`);
    }
  }
}

// Start server
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  process.on('SIGINT', () => {
    db.close();
    process.exit();
  });
});